#!/bin/bash
branch='master'
nextbuild='patch'
git add .
read -p "Type commit message: " message
git commit -m "$message"
npm version $nextbuild
tag=$(git describe)
sleep 3
sed -i "3i- $tag - $message" CHANGELOG.md
sleep 3
git add .
sleep 3
git commit -m "$tag"
sleep 3
git push origin $branch --tags
echo "OK, done"
