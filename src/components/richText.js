import React, { useEffect, useState } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import './richtext.css'
import Preview from './Preview'
import JSONPreview from './JSONPreview'

const RichText = () => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    )

    const [isContent, setIsContent] = useState(false)
    const [raw, setRaw] = useState('')
    const [html, setHTML] = useState('')
    const [rtf, setRTF] = useState('')

    const [isShow, setIsShow] = useState(false)
    const [jsonShow, setJsonShow] = useState(false)

    useEffect(() => {
        checkContentLocalStorage()
        setRaw(convertToRaw(editorState.getCurrentContent()))
        setRTF(editorState.getCurrentContent())
        setEditorState(editorState)

        setHTML(
            draftToHtml(
                convertToRaw(editorState.getCurrentContent()),
                {},
                false,
                ({ type, data }) => {
                    //entity.data.alignment is for float using the LCR options on the image 'none' means the user clicked center
                    console.log(data)
                    console.log(type)
                    if (type === 'IMAGE') {
                        const alignment =
                            data.alignment || 'none' || 'undefined'
                        const textAlign =
                            alignment === 'none' ? 'center' : alignment

                        return `
                <p style="text-align:${textAlign};">
                    <img src="${data.src}" alt="${data.alt}" style="height: ${data.height};width: ${data.width}"/>
                </p>
            `
                    }
                }
            )
        )
    }, [editorState])

    // Example. change by state
    // const xOnChange = (state) => {
    //     checkContentLocalStorage()
    //     setRTF(state.getCurrentContent())

    //     setRaw(convertToRaw(state.getCurrentContent()))

    //     // setHTML(draftToHtml(convertToRaw(state.getCurrentContent())))
    //     setHTML(
    //         draftToHtml(convertToRaw(state.getCurrentContent()), {}, false, ({ type, data }) => {
    //             //entity.data.alignment is for float using the LCR options on the image 'none' means the user clicked center
    //             if (type === 'IMAGE') {
    //                 const alignment = data.alignment || 'none' || 'undefined'
    //                 const textAlign =
    //                     alignment === 'none' ? 'center' : alignment

    //                 return `
    //             <p style="text-align:${textAlign};">
    //                 <img src="${data.src}" alt="${data.alt}" style="height: ${data.height};width: ${data.width}"/>
    //             </p>
    //         `
    //             }
    //         })
    //     )
    //     setEditorState(state)
    // }

    const saveContent = () => {
        localStorage.setItem('_data', JSON.stringify(raw))
        setIsContent(true)
    }

    const checkContentLocalStorage = () => {
        localStorage.getItem('_data') ? setIsContent(true) : setIsContent(false)
    }

    const loadContent = () => {
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
                <button
                    onClick={() => setIsShow(!isShow)}
                    style={{
                        marginLeft: '1rem',
                        // display: html ? 'inline-block' : 'none',
                    }}
                > { isShow ? "Close html preview": "HTML Preview"}</button>
            
               <button
                    onClick={() => setJsonShow(!jsonShow)}
                    style={{
                        marginLeft: '1rem',
                        // display: html ? 'inline-block' : 'none',
                    }}
                > { jsonShow ? "Close json preview": "JSON Preview"}</button>
            </div>

            <div className="Editor">
                {isShow ? <Preview htmlText={html} /> : null}
                {jsonShow ? <JSONPreview htmlText={html} />: null}

                {isShow || jsonShow ? null :
                <Editor
                    editorState={editorState}
                    editorStyle={{
                        border: '1px solid #f1f1f1',
                        backgroundColor: '#fff',
                    }}
                    wrapperStyle={{
                        border: '1px solid #f1f1f1',
                        padding: '2rem',
                        backgroundColor: '#f1f1f1',
                    }}
                    toolbarStyle={{ padding: '1rem' }}
                    onEditorStateChange={setEditorState}
                    toolbar={{
                        options: [
                            'blockType',
                            'fontSize',
                            'inline',
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
                />}
            </div>

            {/* <h3>#debug HTML</h3>
            {html}
            <h3>#debug HTML(escape)</h3>
            {JSON.stringify(html)}

            <h3>#debug ESCAPE</h3>
            {escape(html)}
            <br />
            <h3>#debug RAW</h3>
            {JSON.stringify(raw)}
            <br /> */}
            <h3>#debug RichTextFormat</h3>
            {JSON.stringify(rtf)}
            <br />
        </div>
    )
}

export default RichText
