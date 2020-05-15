// スプレッドシート
const ss = SpreadsheetApp.getActiveSpreadsheet()
// 回答先シート
const current = ss.getSheetByName('当月')

const myFunctionCopyAndNotify = () => {
	if (isCheckDate()) {
		// ファイル名を作成
		const fileName = createFileName()
		// スプレッドシートのコピーを作成
		copy()
		// PDFBlobを作成
		const pdfBlob = createPdfBlob(ss, fileName)
		// googleDriveに保存
		createFile(pdfBlob)
		// ファイルのURLを取得
		const fileUrl = getFileUrl(pdfBlob)
		// LINEへファイルのURLを通知
		sendLine(fileUrl)
		// 自分のメールへ通知
		sendEmail(pdfBlob, fileUrl)
	}
}
const myFunctionOnlyNotifyOfEmail = () => {
	// ファイル名を作成
	const fileName = createFileName()
	// PDFBlobを作成
	const pdfBlob = createPdfBlob(ss, fileName)
	// 自分のメールへ通知
	sendEmail(pdfBlob)
}

// 本日が1日かどうかを判定する関数:boolean
const isCheckDate = () => {
	// スクリプトトリガ実行日
	const today = new Date().getDate()
	// もし１ならtrue
	return today === 15
}

const copy = () => {
	try {
		// 新シート生成

		// 既存シート数
		const index = ss.getNumSheets()

		// シート名生成
		const fileName = createFileName()

		// シート挿入
		ss.insertSheet(fileName, index + 1)

		// 旧シートからコピー

		// 最終行
		const lr = current.getLastRow()
		// 最終列
		const lc = current.getLastColumn()
		// 新シート
		const newSheet = ss.getSheetByName(fileName)
		// 旧シートからデータを転記
		newSheet.getRange(1, 1, lr, lc).setValues(current.getRange(1, 1, lr, lc).getValues())
		// おそらくフォーマットが狂うので整形（ここでは２列目以降に出勤時間、退勤時間が並んでいるものと想定）
		newSheet.getRange(2, 2, lr - 1, lc - 1).setNumberFormat('hh:mm')

		// 旧シート初期化
		// current.deleteRows(2, lr - 1) // あえて.getRange().clear()は使わない

		// トリガーが失敗したら知らせる
	} catch (e) {
		console.log('error::', e)
	}
}
