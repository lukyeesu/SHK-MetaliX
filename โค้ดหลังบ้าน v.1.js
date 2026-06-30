// ==========================================
// ตั้งค่า Web App (โค้ดหลังบ้าน)
// ==========================================

function doGet(e) {
  return HtmlService.createHtmlOutput("SHK Management System Backend is running.");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); 

  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const sheetName = payload.sheetName;
    const data = payload.payload || payload.data;

    let result;
    switch (action) {
      case 'GET_DATA':
        result = getData(sheetName);
        break;
      case 'GET_ALL_DATA':
        result = getAllData(data.sheetNames || data);
        break;
      case 'SAVE_DATA':
        result = saveData(sheetName, data);
        break;
      case 'DELETE_DATA':
        result = deleteData(sheetName, data.id);
        break;
      default:
        result = { status: 'error', message: 'Unknown action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return { status: 'success', data: [] };

  const data = sheet.getDataRange().getValues();
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    const jsonString = data[i][1];
    if (jsonString) {
      try {
        const jsonObj = JSON.parse(jsonString);
        result.push(jsonObj);
      } catch (e) {
        console.error('JSON Error row ' + (i + 1));
      }
    }
  }
  
  result.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  return { status: 'success', data: result };
}

function getAllData(sheetNames) {
  const result = {};
  if (!Array.isArray(sheetNames)) return { status: 'success', data: result };
  for (let i = 0; i < sheetNames.length; i++) {
    const sheetName = sheetNames[i];
    const dataRes = getData(sheetName);
    result[sheetName] = dataRes.status === 'success' ? dataRes.data : [];
  }
  return { status: 'success', data: result };
}

function saveData(sheetName, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['ID', 'Data (JSON)', 'Notes']);
    sheet.setFrozenRows(1);
  }

  const data = sheet.getDataRange().getValues();
  
  // สร้าง ID ก่อนถ้าเป็นรายการใหม่
  if (!payload.id || payload.id === 'AUTO') {
    let prefix = sheetName === 'Customers' ? 'C' : (sheetName === 'Products' ? 'P' : 'ID');
    let maxRunning = 0;
    for (let i = 1; i < data.length; i++) {
      let currentId = data[i][0] ? data[i][0].toString() : '';
      if (currentId.startsWith(prefix + '-')) {
        let numPart = parseInt(currentId.split('-')[1], 10);
        if (!isNaN(numPart) && numPart > maxRunning) maxRunning = numPart;
      }
    }
    payload.id = prefix + '-' + (maxRunning + 1).toString().padStart(4, '0');
  }

  // อัปโหลดรูปภาพ (ต้องมี ID แล้ว)
  if (payload.idCardImageUrl && payload.idCardImageUrl.indexOf('data:image') > -1) {
    let customerName = payload.name ? '_' + payload.name.trim().replace(/\s+/g, '_') : '';
    const uploadRes = uploadImage(payload.idCardImageUrl, 'ID_Card_' + payload.id + customerName + '.jpg');
    if (uploadRes.status === 'success') {
      payload.idCardImageUrl = uploadRes.fileUrl; 
    } else {
      delete payload.idCardImageUrl; 
    }
  }
  
  if (payload._editingId) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload._editingId) {
        payload.updatedAt = new Date().toISOString();
        delete payload._editingId; 
        sheet.getRange(i + 1, 2).setValue(JSON.stringify(payload)); 
        return { status: 'success', message: 'Data updated', data: payload };
      }
    }
    return { status: 'error', message: 'ID not found' };
  }

  payload.createdAt = new Date().toISOString();
  payload.updatedAt = payload.createdAt;
  delete payload._editingId;
  
  sheet.appendRow([payload.id, JSON.stringify(payload), '']);
  return { status: 'success', message: 'Data created', data: payload };
}

function deleteData(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return { status: 'error', message: 'Sheet not found' };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { status: 'success', message: 'Deleted', id: id };
    }
  }
  return { status: 'error', message: 'ID not found' };
}

function uploadImage(base64Data, filename) {
  try {
    const folderId = '1H2awyrZKSrl8mZ091kLMtRel4mFrEq29'; 
    const folder = DriveApp.getFolderById(folderId);
    
    if (base64Data.indexOf(',') > -1) {
      base64Data = base64Data.split(',')[1];
    }
    
    const decodedFile = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedFile, 'image/jpeg', filename);
    const file = folder.createFile(blob);
    
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      // ข้าม error ถ้า Google Workspace ไม่อนุญาตให้แชร์แบบสาธารณะ
      console.log('Share error ignored: ' + shareErr);
    }
    
    return { 
      status: 'success', 
      fileId: file.getId(),
      fileUrl: `https://lh3.googleusercontent.com/d/${file.getId()}`
    };
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}