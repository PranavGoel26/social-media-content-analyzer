import { useState } from "react"
import axios from "axios"

function Analyze() {
  const [text, setText] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null);


  const analyzePost = async () => {
    if (!text) return

    setLoading(true)
    setResult("")

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze",
        { text }
      )

      setResult(response.data.result || "")

    } catch (error) {
      console.error(error)
      setResult("Something went wrong.")
    }

    setLoading(false)
  }


const analyzeFile = async () => {
  if (!file) return;

  setLoading(true);
  setResult("");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://localhost:5000/analyze-file",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setResult(response.data.result || "");

  } catch (error) {
    console.error(error);
    setResult("File analysis failed.");
  }

  setLoading(false);
};




  return (
    <div className="max-w-4xl mx-auto">

      <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
        Analyze Your Post
      </h2>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">

        <textarea
          className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
          rows="6"
          placeholder="Paste your social media post here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-6 border-t pt-6">

  <input
    type="file"
    accept=".pdf,image/*"
    onChange={(e) => setFile(e.target.files[0])}
    className="mb-4"
  />

  <button
    onClick={analyzeFile}
    disabled={loading}
    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
  >
    {loading ? "Analyzing File..." : "Analyze File"}
  </button>

</div>


        <div className="text-center">
          <button
              onClick={analyzePost}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Analyzing..." : "Analyze Post"}
        </button>
        {loading && (
          <p className="mt-4 text-blue-600 font-medium">
            Please wait, your file is getting analyzed...
          </p>
        )}


        </div>

      </div>

      {result && (
        <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold mb-4 text-slate-800">
            AI Response
          </h3>

          <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
            {result}
          </pre>
        </div>
      )}

    </div>
  )
}

export default Analyze
