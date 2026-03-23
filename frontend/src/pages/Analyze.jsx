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
        import.meta.env.VITE_API_URL + "/analyze",
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
        import.meta.env.VITE_API_URL + "/analyze-file",
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

    <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
      Social Media Content Analyzer
    </h2>

    {/* ================= ANALYZE POST SECTION ================= */}
    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-slate-700">
        Analyze Social Media Post
      </h3>

      <textarea
        className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
        rows="6"
        placeholder="Paste your social media post here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

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
    </div>

    {/* DIVIDER */}
    <div className="border-t border-slate-300 my-8"></div>

    {/* ================= ANALYZE FILE SECTION ================= */}
    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
      <h3 className="text-xl font-semibold mb-4 text-slate-700">
        Analyze PDF or Image File
      </h3>

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
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

        {loading && (
          <p className="mt-4 text-purple-600 font-medium">
            Please wait, your file is getting analyzed...
          </p>
        )}
      </div>
    </div>

    {/*RESULT SECTION */}
    {result && (
      <div className="mt-8 bg-white p-8 rounded-xl shadow-md border border-slate-200 transition-all duration-500">
        <h3 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4 flex items-center gap-2">
          ✨ AI Analysis Results
        </h3>
        
        {typeof result === "string" ? (
          <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {result}
          </pre>
        ) : (
          <div className="space-y-8">
            {/* Top Row: Summary & Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  📝 Summary
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm text-lg">
                  {result.summary}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Engagement Score</h4>
                <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-inner border-4 border-blue-100">
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {result.score}
                  </div>
                  <span className="absolute bottom-4 right-4 text-lg font-bold text-blue-300">/10</span>
                </div>
              </div>
            </div>

            {/* Middle Row: Improvements */}
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                📈 Suggested Improvements
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.improvements?.map((imp, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-amber-500 text-xl flex-shrink-0">💡</span>
                    <span className="leading-relaxed">{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Row: Hashtags */}
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                🏷️ Relevant Hashtags
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.hashtags?.map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-semibold border border-purple-200 shadow-sm hover:scale-105 transition-transform cursor-default">
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
  )
  }

  export default Analyze
