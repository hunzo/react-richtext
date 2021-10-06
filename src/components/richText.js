import React, { useEffect, useState } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import './richtext.css'

const RichText = () => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    )

    const [isContent, setIsContent] = useState(false)
    useEffect(() => {
        checkContent()
        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }, [editorState])

    const saveContent = () => {
        localStorage.setItem(
            '_data',
            JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        )
        setIsContent(true)
        // console.log("save data !!")
    }

    const checkContent = () => {
        localStorage.getItem('_data') ? setIsContent(true) : setIsContent(false)
    }

    const loadContent = () => {
        // console.log(convertFromRaw(JSON.parse(localStorage.getItem("_data"))))
        setEditorState(
            EditorState.createWithContent(
                convertFromRaw(JSON.parse(localStorage.getItem('_data')))
            )
        )
    }

    const clearContent = () => {
        setEditorState(EditorState.createEmpty())
        localStorage.clear()
        setIsContent(false)
    }
    const uploadImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () =>
                resolve({
                    data: {
                        link: reader.result,
                    },
                })
            reader.onerror = (error) => reject(error)
        })
    }

    return (
        <div>
            <h1>Rich Text Example</h1>
            <div style={{ marginBottom: '2rem' }}>
                <button onClick={saveContent}>Save Content</button>
                <button
                    onClick={loadContent}
                    style={{
                        marginLeft: '1rem',
                        display: isContent ? 'inline-block' : 'none',
                    }}
                >
                    Load Content Last Save
                </button>
                <button onClick={clearContent} style={{ marginLeft: '1rem' }}>
                    Clear Content
                </button>
            </div>
            <div className="Editor">
                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    toolbar={{
                        options: [
                            'inline',
                            'blockType',
                            'fontSize',
                            'fontFamily',
                            'list',
                            'textAlign',
                            'colorPicker',
                            'link',
                            'embedded',
                            'emoji',
                            'image',
                            'history',
                        ],
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: {
                            urlEnabled: true,
                            uploadEnabled: true,
                            uploadCallback: uploadImage,
                            previewImage: true,
                            alt: { present: false, mandatory: false },
                        },
                    }}
                />
            </div>
            <p>
                <h3>HTML Text</h3>
            </p>
            <textarea
                className="TxA"
                value={draftToHtml(
                    convertToRaw(editorState.getCurrentContent())
                )}
            />

            <h3>HTML</h3>
            {JSON.stringify(
                draftToHtml(convertToRaw(editorState.getCurrentContent()))
            )}
            <br />
            <h3>JSON</h3>
            {JSON.stringify(convertToRaw(editorState.getCurrentContent()))}
            <br />
            <h3>RichText</h3>
            {JSON.stringify(editorState.getCurrentContent())}
            <br />
        </div>
    )
}

export default RichText
