import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Button, Box, Heading, DataTable } from "@primer/react";
import { useState } from "react";
import "./index.css";

export default function ExampleFileBlock(props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";
  // force update?
  const [seed, setSeed] = useState(0);

  return (
    <Box p={4}>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={6}
        overflow="hidden"
      >
        <Box
          bg="canvas.subtle"
          p={3}
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderColor="border.default"
        >
          Reqet File Blob Name: {context.path} {language}
        </Box>
        <Box p={4}>
          <p>Metadata example: this button has been clicked:</p>
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
            {metadata.number || 0} times
          </Button>
          <pre className="mt-3 p-3" key={seed}>
            <Heading>Summary: </Heading> 
            {metadata.reqsetJson && 
            <table>
              <tr>
                <td>File Path</td>
                <td>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Filepath}
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.Name}
                </td>
              </tr>
              <tr>
                <td>
                  Created By
                </td>
                <td>
                  {metadata.reqsetJson.Mf0model.Slreq_datamodel_RequirementSet.CreatedBy}
                </td>
              </tr>
            </table>
            }
            {metadata.reqsetJson && 
            <DataTable>
              
            </DataTable>
            }
          
          </pre>
          

        </Box>
      </Box>
    </Box>
  );
}
