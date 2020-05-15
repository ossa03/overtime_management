// スプレッドシート
const ss = SpreadsheetApp.getActiveSpreadsheet()
// 回答先シート
const current = ss.getSheetByName('当月')

const myFunctionCopyAndNotify = () => {
	if (isCheckDate()) {
		// ファイル名を作成
		const fileName = createFileName()
		// スプレッドシートのコピーを作成
		copySheet()
		// PDFBlobを作成
		const pdfBlob = createPdfBlob(ss, fileName)
		// googleDriveに保存
		const file = createFile(pdfBlob)
		// ファイルのURLを取得
		const fileUrl = getFileUrl(file)
		// LINEへファイルのURLを通知
		sendLine(fileUrl)
		// 自分のメールへ通知
		sendEmail(pdfBlob, fileUrl)
	}
}
const myFunctionOnlyNotifyToEmail = () => {
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
	return today === 1
}

const copySheet = () => {
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
		// おそらくフォーマットが狂うので整形（ここでは4列目以降に残業開始時間、終了時間が並んでいるものと想定）
		newSheet.getRange(2, 4, lr - 1, lc - 1).setNumberFormat('hh:mm')

		// 旧シート初期化
		if (new Date().getDate() === 1) {
			current.deleteRows(2, lr - 1) // あえて.getRange().clear()は使わない
		}

		// トリガーが失敗したら知らせる
	} catch (e) {
		console.log('error::', e)
	}
}
