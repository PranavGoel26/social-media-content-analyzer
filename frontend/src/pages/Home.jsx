import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">

      <h2 className="text-4xl font-bold text-slate-800 mb-6">
        Improve Your Social Media Engagement
      </h2>

      <p className="text-slate-600 text-lg mb-8">
        Analyze your posts using a local AI model. Get instant feedback,
        engagement suggestions, and relevant hashtags — all running locally.
      </p>

      <Link
        to="/analyze"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Start Analyzing
      </Link>

      <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">
            AI-Powered Insights
          </h3>
          <p className="text-slate-600 text-sm">
            Get actionable suggestions to improve your engagement.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">
            Engagement Score
          </h3>
          <p className="text-slate-600 text-sm">
            Understand how effective your content is.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">
            Smart Hashtags
          </h3>
          <p className="text-slate-600 text-sm">
            Generate relevant hashtags instantly.
          </p>
        </div>

      </div>

    </div>
  )
}

export default Home
