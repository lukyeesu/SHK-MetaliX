// ==========================================
// ตั้งค่า Web App
// ==========================================

// ฟังก์ชันสำหรับ GET request (ถ้าจำเป็น)
function doGet(e) {
  return HtmlService.createHtmlOutput("SHK Management System Backend is running.");
}

// ฟังก์ชันหลักสำหรับ POST request ที่รับข้อมูลจาก React App
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // รอคิวสูงสุด 10 วินาที

  try {
    // รับข้อมูลที่ส่งมาจาก Frontend
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const sheetName = payload.sheetName;
    const data = payload.payload;

    let result;

    // เลือกทำงานตาม action ที่ส่งมา
    switch (action) {
      case 'GET_DATA':
        result = getData(sheetName);
        break;
      case 'GET_ALL_DATA':
        result = getAllData(data.sheetNames);
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

    // ส่งผลลัพธ์กลับไปให้ Frontend
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // กรณีเกิดข้อผิดพลาด
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock(); // ปล่อยล็อกเสมอ
  }
}

// ==========================================
// ฟังก์ชันจัดการข้อมูล (CRUD) รูปแบบ JSON สากล
// ==========================================

// ฟังก์ชันเตรียม Sheet (สร้าง Header ถ้ายังไม่มี)
function initSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // กำหนด Header พื้นฐาน
    sheet.appendRow(['ID', 'Data (JSON)', 'Notes']);
    // ล็อกแถวแรก (Header)
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveData(sheetName, payload) {
  initSheet(sheetName);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  // 1. ถ้าระบุ _editingId มา แสดงว่าเป็นการ "แก้ไข" ข้อมูลเดิม (Update)
  if (payload._editingId) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload._editingId) {
        payload.updatedAt = new Date().toISOString();
        delete payload._editingId; // ลบฟิลด์ช่วยเช็คทิ้งก่อนเซฟลง DB
        // อัปเดตข้อมูลในคอลัมน์ที่ 2 (Data JSON)
        sheet.getRange(i + 1, 2).setValue(JSON.stringify(payload)); 
        return { status: 'success', message: 'Data updated successfully', data: payload };
      }
    }
    return { status: 'error', message: 'Update failed: ID not found' };
  }

  // 2. ถ้าเป็นการ "สร้างใหม่" (Insert) 
  // หากหน้าบ้านส่ง ID มาให้แล้ว (เช่น REC26060001) และไม่ได้ส่งมาเป็น AUTO ให้ใช้ ID นั้นเลย
  if (!payload.id || payload.id === 'AUTO') {
    let prefix = sheetName === 'Customers' ? 'C' : (sheetName === 'Products' ? 'P' : 'ID');
    let maxRunning = 0;
    
    // ค้นหารหัสที่ค่าตัวเลขสูงที่สุดในระบบตอนนี้
    for (let i = 1; i < data.length; i++) {
      let currentId = data[i][0] ? data[i][0].toString() : '';
      if (currentId.startsWith(prefix + '-')) {
        let numPart = parseInt(currentId.split('-')[1], 10);
        if (!isNaN(numPart) && numPart > maxRunning) {
          maxRunning = numPart;
        }
      }
    }
    
    // สร้างรหัสใหม่ รันต่อไป +1
    payload.id = prefix + '-' + (maxRunning + 1).toString().padStart(4, '0');
  }
  
  payload.createdAt = new Date().toISOString();
  payload.updatedAt = payload.createdAt;
  delete payload._editingId; // ลบทิ้งก่อนเซฟ
  
  // เพิ่มแถวใหม่ต่อท้าย
  sheet.appendRow([payload.id, JSON.stringify(payload), '']);
  return { status: 'success', message: 'Data created successfully', data: payload };
}

function getData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) {
    return { status: 'success', data: [] };
  }

  const data = sheet.getDataRange().getValues();
  const result = [];
  
  // เริ่มอ่านจากแถวที่ 2 (index 1) เพราะแถวแรกเป็น Header
  for (let i = 1; i < data.length; i++) {
    const jsonString = data[i][1]; // ข้อมูล JSON อยู่ในคอลัมน์ที่ 2 (index 1)
    if (jsonString) {
      try {
        const jsonObj = JSON.parse(jsonString);
        result.push(jsonObj);
      } catch (e) {
        console.error('Error parsing JSON in row ' + (i + 1) + ': ' + e.toString());
      }
    }
  }
  
  // เรียงลำดับข้อมูลจากใหม่ไปเก่า (ตาม updatedAt หรือ createdAt)
  result.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0);
    const dateB = new Date(b.updatedAt || b.createdAt || 0);
    return dateB - dateA; // มากไปน้อย (ใหม่ไปเก่า)
  });

  return { status: 'success', data: result };
}

function getAllData(sheetNames) {
  const result = {};
  for (let i = 0; i < sheetNames.length; i++) {
    const sheetName = sheetNames[i];
    const dataRes = getData(sheetName);
    result[sheetName] = dataRes.status === 'success' ? dataRes.data : [];
  }
  return { status: 'success', data: result };
}

function deleteData(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    return { status: 'error', message: 'Sheet not found' };
  }

  const data = sheet.getDataRange().getValues();
  // ค้นหาแถวที่มี ID ตรงกัน
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      // ลบแถวนั้น (i + 1 เพราะ row เริ่มที่ 1)
      sheet.deleteRow(i + 1);
      return { status: 'success', message: 'Data deleted successfully', id: id };
    }
  }
  
  return { status: 'error', message: 'Delete failed: ID not found' };
}