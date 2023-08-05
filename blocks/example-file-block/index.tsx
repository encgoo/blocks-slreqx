import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Button, Box, Heading, Textarea, TabNav, TextInput, ActionMenu, ActionList, Dialog, Text } from "@primer/react";
import { useState } from "react";
import "./index.css";


export default function ExampleFileBlock(props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";
  // force update?
  const [seed, setSeed] = useState(0);
  // other user inputs
  const [selSeed, setSelSeed] = useState(0);
  const [sumValue, setSumValue] = useState('');
  const [openLogin, setOpenLogin] = useState(false);
  const [tmpServer, setTmpServer] = useState("");
  const [tmpUsr, setTmpUsr] = useState("");
  const [tmpPwd, setTmpPwd] = useState("");

  const tableStyle = {
    "width": "100%", 
    "border": "1px solid black",
    "textAlign": "left",
    "background-color": "white"
  };
  const tdStyle = {
    "border": "1px solid black"
  };
  const thStyle = {
    "background-color": "lightblue",
    "border": "1px solid black"
  };
  const pStyle = {
    "background-color": "#f2f2f2"
  };
  const reqTableStyle = {
    "width": "100%",
    "vertical-align": "top"
  };
  const ovStyle = {
    "width": "50%",
    "background-color": "#f2f2f2",
    "border": "5px solid white",
    "vertical-align": "top"
  };
  const hrStyle = {
    "border": "none",
    "height": "0.5px",
    "background": "#e2e2e2"
  }

  function onSummaryChange(e:Event){
    var newSummary = e.target.value;
    metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[selSeed].Summary = newSummary;
    setSumValue(newSummary);
  };

  function onChangeServer(e: Event){
    setTmpServer(e.target.value);
  }

  function onChangeUsr(e: Event){
    setTmpUsr(e.target.value);
  }

  function onChangePwd(e: Event){
    setTmpPwd(e.target.value);
  }

  function onLogin(e: Event){
    // Set global variables?
    localStorage.setItem('server_addr', tmpServer);
    localStorage.setItem('server_usr', tmpUsr);
    localStorage.setItem('server_pwd', tmpPwd);
    setOpenLogin(false);
    refreshBlock();
  }

  function update(e: Event){
    // debug only
    localStorage.setItem('server_addr', "");
  }
  function refreshBlock(){
    // Use github api to retrieve content again
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28
    // Seems like blocks handle the token for us.
    const url1 = 'https://api.github.com/repos/encgoo/blocks-slreqx/contents/' + context.path;
    fetch(url1,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/zip',
      },                 
    }).then((response) => {

      response.json().then( (json) => { 

      var url = "http://172.21.74.106:8808/reqset/a";
      if (localStorage.getItem('server_addr')){
        url = localStorage.getItem('server_addr') + "/reqset/a";
      }
      
      // Now post to local golang server
      fetch(url, { 
        method: 'POST', 
          headers: {
            'Content-Type': 'application/zip',
          },
          body: json.content, 
          mode: 'cors'}).then((resp) =>{
            resp.json().then((js) => {
              metadata.reqsetJson = js;
              // clean up the description by removing all the html tags
              for (var i = 0; i < metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items.length; ++i){
                const reqItem = metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[i];
                var desc = reqItem.Description;
                var removed = desc.replace(/(<([^>]+)>)/ig, '');
                var cleaned = removed.replace('p, li { white-space: pre-wrap; }', '');
                var cln = cleaned.replaceAll('\n', '');
                metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[i].Description = cln;
              }
              setSeed(seed + 1);
              setSumValue(metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[0].Summary);
            })
          })
        .then((result) => {})
      }
    );

    }).then((result) => {
      var cont = result;
    });
  }
  return (
    <Box p={4}>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={6}
        overflow="hidden"
      >
        <Box p='3'>
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'}}>
          <Button
            onClick={() =>{
              const addr = localStorage.getItem('server_addr');

              if (!addr){
                // show login dialog
                setOpenLogin(true);
              } else {
                refreshBlock();
              }
            }}
          >
            Refresh
          </Button><Button onClick={update}>Save Changes</Button>
          <Dialog
            isOpen={openLogin}
            onDismiss={() => setOpenLogin(false)}
            >
              <Dialog.Header>
                Login
              </Dialog.Header>
              <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                <Text>Server:</Text><TextInput onChange={onChangeServer} value={tmpServer}></TextInput>
                <Text>Username:</Text><TextInput onChange={onChangeUsr} value={tmpUsr}></TextInput>
                <Text>Password:</Text><TextInput onChange={onChangePwd} value={tmpPwd}></TextInput>
              </Box>
              <Box display="flex" mt={3} justifyContent="flex-end">
                <Button onClick={onLogin}>Login</Button>
              </Box>
            </Dialog>
          </Box>
          <hr style={hrStyle}></hr>
          <p key={seed}>
            <Heading sx={{fontSize: 3, mb:2}}>Requirement Set</Heading> 
            <p style={pStyle}>
              <Heading sx={{fontSize: 2, mb:3}}>Summary</Heading>
            {metadata.reqsetJson && 
            <table style={tableStyle}>
              <tr>
                <th style={thStyle}>File Path</th>
                <td style={tdStyle}>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Filepath}
                </td>
              </tr>
              <tr>
                <th style={thStyle}>Name</th>
                <td style={tdStyle}>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Name}
                </td>
              </tr>
              <tr>
                <th style={thStyle}>
                  Created By
                </th>
                <td style={tdStyle}>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.CreatedBy}
                </td>
              </tr>
            </table>
            }
            </p>
            <Heading sx={{fontSize: 4, mb:2}}>Requirements</Heading>
            <table style={reqTableStyle}>
              <tr>
                <td style={ovStyle}>
                  <p style={pStyle}>
                    <Heading sx={{fontSize: 3, mb:2}}>Overview</Heading>
                    {metadata.reqsetJson &&
                    <table style={tableStyle}>
                      <tr>
                        <th style={thStyle}>SID</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Summary</th>
                        <th style={thStyle}>Description</th>
                      </tr>
                      <tbody>
                        {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items.map((req, i) =>{
                          return [
                            <tr onClick={()=>{
                              setSumValue(req.Summary);
                              setSelSeed(i);
                            }}>
                              <td style={tdStyle}>
                                {req.Sid}
                              </td>    
                              <td style={tdStyle}>
                                {req.TypeName}
                              </td>    
                              <td style={tdStyle}>
                                {req.Summary}
                              </td>    
                              <td style={tdStyle}>
                                {req.Description}
                              </td>    
                            </tr>
                          ];
                        })}
                      </tbody>
                    </table>
                    }
                  </p>
                </td>
                <td style={ovStyle}>
                  { metadata.reqsetJson &&
                  <p style={pStyle} key={selSeed}>
                    <Heading sx={{fontSize: 3, mb:2}}>Properties</Heading>
                    <table>
                      <tr>
                        <td>Type:</td>
                        <td><ActionMenu>
                      <ActionMenu.Button>Functional</ActionMenu.Button>
                      <ActionMenu.Overlay>
                        <ActionList>
                          <ActionList.Item>Informational</ActionList.Item>
                          <ActionList.Item>Container</ActionList.Item>
                        </ActionList>
                      </ActionMenu.Overlay>
                    </ActionMenu>
                    </td>
                    </tr>
                    <tr>
                      <td>Custom ID:</td>
                      <td>{metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[selSeed].Sid}</td>
                    </tr>
                    <tr>
                    <td> Summary: </td>
                    <td>
                    <TextInput 
                      onChange={onSummaryChange}
                      width='700px'
                      value={sumValue}
                    ></TextInput>
                    </td>
                    </tr>
                    </table>
                    <TabNav aria-label="Main">
                      <TabNav.Link href="#desc" selected>Description</TabNav.Link>
                      <TabNav.Link href="#rati">Rationale</TabNav.Link>
                    </TabNav>
                    <Textarea
                      cols={100}
                      rows={8}
                    >{metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[selSeed].Description}</Textarea>
                    <p>Links</p>
                    <Textarea
                      cols={100}
                      rows={3}
                      defaultValue="No links"
                      disabled
                      ></Textarea>
                  </p>
                  }
                </td>
              </tr>
          </table>
          </p>
        </Box>
      </Box>
    </Box>
  );
}
