export function stripAllTestedCode(reportStr: string) {

	let report
	try {
		report = JSON.parse(reportStr);
	} catch (e) {
		return null
	}

	var linesElem = "Lines"
	var branchesElem = "Branches"
	var hitsElem = "Hits"

	for(var dll in report) {
		for(var srcFile in report[dll]) {
			var removeSrcFile = true

			for(var className in report[dll][srcFile]) {
				var classElem = report[dll][srcFile][className]
				var removeClass = true

				for(var classMethod in classElem) {
					var methodElem = report[dll][srcFile][className][classMethod]
					var removeMethod = true
					var removeLinesElem = true
					var removeBranchesElem = true

					if(methodElem.hasOwnProperty(linesElem)){
						for(var linenumber in methodElem[linesElem]){
							if(methodElem[linesElem][linenumber] == 0) {
								removeLinesElem = false
								removeMethod = false
								removeClass = false
								removeSrcFile = false
							}
							else {
								delete methodElem[linesElem][linenumber]
							}
						}

						if(removeLinesElem){
							delete methodElem[linesElem]
						}
					}

					if(methodElem.hasOwnProperty(branchesElem)){
						for (let i = 0; i < methodElem[branchesElem].length; i++) {
							if(!methodElem[branchesElem][i].hasOwnProperty(hitsElem))
								return null

							if(methodElem[branchesElem][i][hitsElem] == 0)	{
								removeBranchesElem = false
								removeMethod = false
								removeClass = false
								removeSrcFile = false
							}
							else {
								delete methodElem[branchesElem][i]
							}
						}

						if(removeBranchesElem){
							delete methodElem[branchesElem]
						}
						else {
							methodElem[branchesElem] = methodElem[branchesElem].filter(function (el: any) {
								return el != null;
							});
						}
					}

					if(removeMethod){
						delete report[dll][srcFile][className][classMethod]
					}
				}

				if(removeClass){
					delete report[dll][srcFile][className]
				}
			}

			if(removeSrcFile){
				delete report[dll][srcFile]
			}
		}
	}

	return report
}

export function stripAllButOneClass(reportStr: string, className: string) {
	//TODO
}