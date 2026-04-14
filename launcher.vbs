Dim fso, shell, distPath

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

distPath = fso.BuildPath(fso.GetParentFolderName(WScript.ScriptFullName), "dist")
If Not fso.FolderExists(distPath) Then
    shell.Run "cmd /c npm run build", 1, True
End If

CreateObject("Wscript.Shell").Run "node node_modules\electron\cli . > output.log", 0
