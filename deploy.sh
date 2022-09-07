#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 获取leetcode
# npm run ac_record

# git add ./docs/.vitepress/components/lcData.json
# git commit -m "get ac record"
# git push

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd docs/.vitepress/dist

git init
git config --global user.email "acb973834183@163.com"
git config --global user.name "haloleve"
git config --global init.defaultBranch main
git branch -m master main
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:haloleve/blog.git main:gh-pages

cd -
