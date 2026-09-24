/**
 * GOOGLE APPS SCRIPT BACKEND (100% GRATIS)
 * SISTEM ADMINISTRASI TERPADU WPI:
 * - TABEL 1: DB_JOBDESK (Checklist Harian)
 * - TABEL 2: DB_PURCHASING (Monitoring Pengadaan Barang)
 * - TABEL 3: DB_TAGIHAN (Monitoring Tagihan & Invoice)
 * 
 * CARA PEMASANGAN:
 * 1. Buka Google Spreadsheet baru (atau gunakan spreadsheet yang sudah ada).
 * 2. Klik menu "Ekstensi" (Extensions) -> "Apps Script".
 * 3. Hapus kode default di Code.gs, lalu tempelkan seluruh kode ini.
 * 4. Klik ikon Simpan (Ctrl + S).
 * 5. Klik tombol biru "Deploy" (Terapkan) di kanan atas -> pilih "New deployment" (Deployment baru).
 * 6. Pilih tipe "Web app".
 * 7. Pada setting:
 *    - Execute as: "Me" (Saya)
 *    - Who has access: "Anyone" (Siapa saja)  <-- WAJIB!
 * 8. Klik "Deploy", izinkan hak akses Google (Authorize), lalu salin "Web App URL" yang berakhiran /exec.
 * 9. Tempelkan URL tersebut ke dalam menu Pengaturan di aplikasi Web WPI Admin Hub.
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  
  if (action === 'ping') {
    return createJsonResponse({ status: 'success', message: 'Koneksi Google Spreadsheet Aktif & Siap Digunakan!' });
  }

  if (action === 'getAll') {
    return getAllDataFromSheets();
  }

  return createJsonResponse({ status: 'error', message: 'Aksi GET tidak dikenali' });
}

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    // Tunggu maksimal 15 detik jika ada pengiriman simultan
    lock.waitLock(15000);

    initSheetsIfNotExist();

    var contents = JSON.parse(e.postData.contents);
    var action = contents.action || 'syncAll';

    if (action === 'syncAll') {
      saveAllData(contents);
      lock.releaseLock();
      return createJsonResponse({ status: 'success', message: 'Seluruh data berhasil disinkronkan ke Google Sheet!' });
    }

    lock.releaseLock();
    return createJsonResponse({ status: 'success', message: 'Data diproses.' });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function initSheetsIfNotExist() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet Job Desk
  var sheetJob = ss.getSheetByName('DB_JOBDESK');
  if (!sheetJob) {
    sheetJob = ss.insertSheet('DB_JOBDESK');
    sheetJob.appendRow(['ID Tugas', 'Nama Tugas', 'Kategori', 'Frekuensi', 'Target Waktu', 'PIC', 'Status', 'Catatan', 'Terakhir Update']);
    sheetJob.getRange('A1:I1').setBackground('#2563eb').setFontColor('#ffffff').setFontWeight('bold');
    sheetJob.setFrozenRows(1);
  }

  // 2. Sheet Purchasing
  var sheetPurchasing = ss.getSheetByName('DB_PURCHASING');
  if (!sheetPurchasing) {
    sheetPurchasing = ss.insertSheet('DB_PURCHASING');
    sheetPurchasing.appendRow(['ID', 'No. PO / Pengajuan', 'Tanggal Request', 'Nama Barang', 'Kategori', 'Divisi', 'Qty', 'Estimasi Biaya (Rp)', 'Vendor / Toko', 'Status', 'Est Tiba / Tiba', 'Catatan / Resi', 'Terakhir Update']);
    sheetPurchasing.getRange('A1:M1').setBackground('#059669').setFontColor('#ffffff').setFontWeight('bold');
    sheetPurchasing.setFrozenRows(1);
  }

  // 3. Sheet Tagihan
  var sheetTagihan = ss.getSheetByName('DB_TAGIHAN');
  if (!sheetTagihan) {
    sheetTagihan = ss.insertSheet('DB_TAGIHAN');
    sheetTagihan.appendRow(['ID', 'No. Invoice', 'Nama Vendor', 'Kategori', 'Keperluan / Keterangan', 'Nominal Tagihan (Rp)', 'Tanggal Tagihan', 'Tanggal Jatuh Tempo', 'Status Pembayaran', 'Tanggal Pelunasan', 'Terakhir Update']);
    sheetTagihan.getRange('A1:K1').setBackground('#8b5cf6').setFontColor('#ffffff').setFontWeight('bold');
    sheetTagihan.setFrozenRows(1);
  }
}

function saveAllData(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var timestamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');

  // 1. Simpan DB_JOBDESK
  if (data.tasks && Array.isArray(data.tasks)) {
    var sheetJob = ss.getSheetByName('DB_JOBDESK');
    if (sheetJob.getLastRow() > 1) {
      sheetJob.getRange(2, 1, sheetJob.getLastRow() - 1, 9).clearContent();
    }
    var jobRows = data.tasks.map(function(t) {
      return [
        t.id || '',
        t.title || '',
        t.category || '',
        t.frequency || '',
        t.dueTime || '',
        t.pic || '',
        t.status || 'pending',
        t.notes || '',
        timestamp
      ];
    });
    if (jobRows.length > 0) {
      sheetJob.getRange(2, 1, jobRows.length, 9).setValues(jobRows);
    }
  }

  // 2. Simpan DB_PURCHASING
  if (data.purchasing && Array.isArray(data.purchasing)) {
    var sheetPur = ss.getSheetByName('DB_PURCHASING');
    if (sheetPur.getLastRow() > 1) {
      sheetPur.getRange(2, 1, sheetPur.getLastRow() - 1, 13).clearContent();
    }
    var purRows = data.purchasing.map(function(p) {
      return [
        p.id || '',
        p.poNumber || '',
        p.requestDate || '',
        p.itemName || '',
        p.category || '',
        p.division || '',
        p.qty || '',
        p.estimatedCost || 0,
        p.vendor || '',
        p.status || 'Diajukan',
        p.estArrivalDate || '',
        p.notes || '',
        timestamp
      ];
    });
    if (purRows.length > 0) {
      sheetPur.getRange(2, 1, purRows.length, 13).setValues(purRows);
    }
  }

  // 3. Simpan DB_TAGIHAN
  if (data.tagihan && Array.isArray(data.tagihan)) {
    var sheetTag = ss.getSheetByName('DB_TAGIHAN');
    if (sheetTag.getLastRow() > 1) {
      sheetTag.getRange(2, 1, sheetTag.getLastRow() - 1, 11).clearContent();
    }
    var tagRows = data.tagihan.map(function(t) {
      return [
        t.id || '',
        t.invoiceNo || '',
        t.vendor || '',
        t.category || '',
        t.description || '',
        t.amount || 0,
        t.invoiceDate || '',
        t.dueDate || '',
        t.status || 'unpaid',
        t.paidDate || '',
        timestamp
      ];
    });
    if (tagRows.length > 0) {
      sheetTag.getRange(2, 1, tagRows.length, 11).setValues(tagRows);
    }
  }

  SpreadsheetApp.flush();
}

function getAllDataFromSheets() {
  initSheetsIfNotExist();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Read Tasks
  var sheetJob = ss.getSheetByName('DB_JOBDESK');
  var tasks = [];
  if (sheetJob.getLastRow() > 1) {
    var vals = sheetJob.getRange(2, 1, sheetJob.getLastRow() - 1, 9).getValues();
    tasks = vals.map(function(r) {
      return {
        id: r[0],
        title: r[1],
        category: r[2],
        frequency: r[3],
        dueTime: r[4],
        pic: r[5],
        status: r[6],
        notes: r[7]
      };
    });
  }

  // Read Purchasing
  var sheetPur = ss.getSheetByName('DB_PURCHASING');
  var purchasing = [];
  if (sheetPur.getLastRow() > 1) {
    var valsP = sheetPur.getRange(2, 1, sheetPur.getLastRow() - 1, 13).getValues();
    purchasing = valsP.map(function(r) {
      return {
        id: r[0],
        poNumber: r[1],
        requestDate: r[2],
        itemName: r[3],
        category: r[4],
        division: r[5],
        qty: r[6],
        estimatedCost: r[7],
        vendor: r[8],
        status: r[9],
        estArrivalDate: r[10],
        notes: r[11]
      };
    });
  }

  // Read Tagihan
  var sheetTag = ss.getSheetByName('DB_TAGIHAN');
  var tagihan = [];
  if (sheetTag.getLastRow() > 1) {
    var valsT = sheetTag.getRange(2, 1, sheetTag.getLastRow() - 1, 11).getValues();
    tagihan = valsT.map(function(r) {
      return {
        id: r[0],
        invoiceNo: r[1],
        vendor: r[2],
        category: r[3],
        description: r[4],
        amount: r[5],
        invoiceDate: r[6],
        dueDate: r[7],
        status: r[8],
        paidDate: r[9]
      };
    });
  }

  return createJsonResponse({
    status: 'success',
    data: {
      tasks: tasks,
      purchasing: purchasing,
      tagihan: tagihan
    }
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
