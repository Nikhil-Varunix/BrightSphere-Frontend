
const Loader = () => {
    return (
        <div className="loader" style={{ display: "flex", opacity: 1 }}>
            <div className="p-4 text-center">
                <div className="custom-loader" />
                <h2 className="my-3 f-w-400">Loading..</h2>
                <p className="mb-0">
                    Please wait while we get your information from the web
                </p>
            </div>
        </div>
    )
}

export default Loader