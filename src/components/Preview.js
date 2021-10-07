import DOMPurify from 'dompurify'
import React from 'react'

function Preview({ htmlText }) {
    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html),
        }
    }
    return (
        <div>
            <h2>HTML Preview</h2>
            <div
                style={{
                    border: '1px solid #e1e1e1',
                    // padding: '5px',
                    marginTop: '2rem',
                    marginBottom: '2rem',
                }}
                dangerouslySetInnerHTML={createMarkup(htmlText)}
            />
        </div>
    )
}

export default Preview
