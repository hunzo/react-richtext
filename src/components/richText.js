import React, {useEffect, useState} from 'react'
import {EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'

const RichText = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    useEffect(() => {
        // setdata(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }, [editorState]) 
    return (
        <div>
            {JSON.stringify(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
            <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            />

            <textarea value={
                draftToHtml(convertToRaw(editorState.getCurrentContent()))
            }/>
            
        </div>
    )
}

export default RichText
