import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Button, Box, Heading, Textarea } from "@primer/react";
import { useState } from "react";
import "./index.css";

export default function ExampleFileBlock(props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";
  // force update?
  const [seed, setSeed] = useState(0);
  const [selSeed, setSelSeed] = useState(0);

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
    "width": "100%"
  };
  const ovStyle = {
    "width": "50%",
    "background-color": "#f2f2f2",
    "border": "5px solid white"
  };
  return (
    <Box p={4}>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={6}
        overflow="hidden"
      >
        <Box p={4}>
          <Button
            onClick={() =>{ 
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

                  const url = "http://172.21.74.106:8808/reqset/a";
                  
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
                        })
                      })
                    .then((result) => {})
                  }
                );

                }).then((result) => {
                  var cont = result;
                });
               }
            }
          >
            Refresh
          </Button>
          <p key={seed}>
            <Heading >Requirement Set</Heading> 
            <p style={pStyle}>
              <p>Summary</p>
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
            <Heading>Requirements {seed}</Heading>
            <table style={reqTableStyle}>
              <tr>
                <td style={ovStyle}>
                  <p style={pStyle}>
                    <p>Requirements</p>
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
                  <p style={pStyle} key={selSeed}>
                    <p>Property</p>
                    <p>Summary</p>
                    <Textarea>{metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[selSeed].Summary}</Textarea>
                    <p>Description</p>
                    <Textarea>{metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items[selSeed].Description}</Textarea>
                    <p>Links</p>
                  </p>
                </td>
              </tr>
          </table>
          </p>
        </Box>
      </Box>
    </Box>
  );
}
