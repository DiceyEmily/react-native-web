: 批处理所在目录：%~dp0
cd "%~dp0"

: 包含路径：%~1 文件全名为: %~nx1, 文件名为： %~n1, 扩展名为： %~x1
node_modules/.bin/ts-node --project ./src/rn-common/taskconfig.json src/rn-common/task/generateIcon.ts  "%~1"
