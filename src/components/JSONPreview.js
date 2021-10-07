import React from 'react'

function JSONPreview({ htmlText }) {
    return (
        <div>
            <h2>JSON Preview</h2>
            <div
                style={{
                    border: '1px solid #e1e1e1',
                    // padding: '5px',
                    marginTop: '2rem',
                    marginBottom: '2rem',
                }}
            >{JSON.stringify(htmlText)}</div>
        </div>
    )
}

export default JSONPreview
