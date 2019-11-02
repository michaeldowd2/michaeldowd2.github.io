cd %~dp0
cd ..
git add --all
git commit -m "update site files"
xcopy .git\index website\ /Y
git add Website\index
git commit -m "update site index"
git push -u
pause