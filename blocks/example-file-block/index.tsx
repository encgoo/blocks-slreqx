import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Button, Box, Heading } from "@primer/react";
import { useState } from "react";
import "./index.css";

export default function ExampleFileBlock(props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";
  // force update?
  const [seed, setSeed] = useState(0);

  const tableStyle = {
    "width": "100%", 
    "border": "1px solid black",
    "textAlign": "left"
  };
  const tdStyle = {
    "border": "1px solid black"
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

                  const url = "http://10.0.2.15:8089/reqset/a";
                  
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
            View Requirement Set
          </Button>
          <pre className="mt-3 p-3" key={seed}>

            <Heading >Summary: </Heading> 
            <hr/>
            {metadata.reqsetJson && 
            <table style={tableStyle}>
              <tr>
                <th style={tdStyle}>File Path</th>
                <td style={tdStyle}>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Filepath}
                </td>
              </tr>
              <tr>
                <th style={tdStyle}>Name</th>
                <td style={tdStyle}>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Name}
                </td>
              </tr>
              <tr>
                <th style={tdStyle}>
                  Created By
                </th>
                <td style={tdStyle}>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.CreatedBy}
                </td>
              </tr>
            </table>
            }
            <br/>
            <br/>
            <Heading>Requirement Set</Heading>
            <hr/>
            {metadata.reqsetJson &&
            <table style={tableStyle}>
              <tr>
                <th style={tdStyle}>Index</th>
                <th style={tdStyle}>SID</th>
                <th style={tdStyle}>Summary</th>
                <th style={tdStyle}>Description</th>
              </tr>
              <tbody>
                {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Items.map((req, i) =>{
                  return [
                    <tr>
                      <td style={tdStyle}>
                        {i}
                      </td>    
                      <td style={tdStyle}>
                        {req.Sid}
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

          </pre>
          

        </Box>
      </Box>
    </Box>
  );
}
