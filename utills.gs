// スプレッドシートをPDFとして取得する
const createPdfBlob = (spreadSheet, fileName) => {
	//スプレッドシート全部をPDFとして取得されてしまう
	//! スプレッドシートを1シートずつPDF化する方法はないのか？
	const pdfBlob = spreadSheet.getAs('application/pdf').setName(`${fileName}.pdf`)
	// const pdfBlob = spreadSheet.getBlob().getAs('image/jpeg').setName(`${fileName}.jpeg`)
	// -->Exception: application/pdf から image/jpeg への変換はサポートされていません。
	return pdfBlob
}

// googleDriveの指定のフォルダ("過去データ")へ保存する
const createFile = (blob) => {
	// Folderオブジェクト.createFile(Blobオブジェクト)
	const FOLDER_ID = PropertiesService.getScriptProperties().getProperty('FOLDER_ID') //フォルダIDを指定
	const folder = DriveApp.getFolderById(FOLDER_ID) //フォルダIDを指定
	const file = folder.createFile(blob)
	return file
}

// googleDriveに保存したファイルのURLを取得する
const getFileUrl = (file) => {
	// Fileオブジェクト.getUrl()
	const fileUrl = file.getUrl()
	return fileUrl
}

// 自分宛てにPDFBlobをメールで送信する
const sendEmail = (pdfBlob, url) => {
	const MY_ADDRESS = PropertiesService.getScriptProperties().getProperty('MY_ADDRESS')
	const fileUrl = url ? url : ''
	MailApp.sendEmail(
		MY_ADDRESS, // 宛先
		'残業報告', // 件名
		`PDFを送りました\n` + fileUrl, //本文
		// 添付ファイル(pdf)
		{ attachments: [pdfBlob] },
	)
}

const createFileName = () => {
	// 日付
	const date = new Date()
	// 年
	const yy = date.getFullYear()
	// 月（前月が返ることに注意）
	let mm = date.getMonth()
	// １０月未満の場合は頭に０を付す
	if (mm < 10) {
		mm = '0' + mm
		// １月の場合は０が返るから１２月とする
	} else if (mm === 0) {
		mm = 12
	}
	// シート名生成
	const fileName = yy + mm
	return fileName
}
