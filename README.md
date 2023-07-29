# Blocks-slreqx

## Development env settings
### node
Need to install node >= 14. 
Use this to force lts nodejs. Otherwise v12 will be installed. Blocks needs 14.
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

If a public key is not found then:
```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 23E7166788B63E1E
```

Now install node
```bash
sudo apt-get install -y nodejs
```

### yarn
Need to uninstall cmdtest first, then install yarn. Otherwise the wrong yarn is used.
```bash
sudo npm install -g yarn
```

## Getting started
```bash
yarn
yarn start
```
This starts a node.js server in port 4000. Use
```bash
sudo lsof -i -P -n | grep LISTEN
```
Use a browser to open `localhost:4000` to see. Go to `blocks.githubnext.com/encgoo/blocks-slreqx` to see the effect.


## Developement
[Reference](https://blocks.githubnext.com/githubnext/blocks/blob/main/docs/Developing%20blocks/1%20Intro.md?blockKey=githubnext__blocks-examples__markdown-block&fileRef=) of information.

A block is a React component. 

The Blocks platform supplies a content to render and hooks that a block can call the take actions like _updating_ content. Blocks platform runs on blocks.githubnext.com

### file block
Receives content of a file.

### folder block
Receives content of a folder.

This repo is a clone of the blocks-template. 

### Define custom block
In blocks.config.json, change name and submit. Now if running locally via localhost:4000, the block is visible for pickup from the drop down picker directly. This is true for githubnext/blocks.

Use this url to view a slreqx. No need to push the change of js code to github before seeing the modification. Need the devServer running locally (localhost:4000).
https://blocks.githubnext.com/encgoo/blocks-slreqx/blob/main/docs/HLR.slreqx?devServer=http%3A%2F%2Flocalhost%3A4000%2F&blockKey=encgoo__blocks-slreqx__slreqx-block&fileRef=


But if go to own repo, then the block is not shown for pickup. Try to search block by entering https://github.com/encgoo/block-slreqx. It will show up after deployed. Not sure if it shows before deployed.





