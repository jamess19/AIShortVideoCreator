'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Sparkles, Zap, Users, Star, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useState } from "react"

const testimonials = [
  {
    name: "Ankush C.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote: (
      <>
        "Possibly the{" "}
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          best tool
        </span>{" "}
        for video making"
      </>
    ),
    badge: "Capterra",
    rating: 5,
  },
  {
    name: "Linda T.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote: (
      <>
        "Create video in 2 minutes.{" "}
        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Unbelievable!
        </span>"
      </>
    ),
    badge: "G2",
    rating: 5,
  },
  {
    name: "David N.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote: (
      <>
        "The AI voice feature is{" "}
        <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          mind-blowing
        </span>!"
      </>
    ),
    badge: "Trustpilot",
    rating: 5,
  },
];

export default function LandingPage() {
    const [testimonialIdx, setTestimonialIdx] = useState(0);

  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">VideoAI</span>
              </div>

            </div>

            <div className="flex items-center gap-2">
                 <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-300">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="relative h-[450px] md:h-[520px] rounded-3xl overflow-hidden flex items-center justify-center">
          {/* Video Background */}
          <div className="absolute top-0 left-0 h-full w-full bg-black">
            <video
              className="object-contain h-full w-full rounded-3xl"
              autoPlay
              muted
              playsInline
              preload="auto"
              loop
              poster="https://res.cloudinary.com/dzgatscqu/video/upload/v1751128713/videoplayback_maiivz.jpg"
            >
              <source src="https://res.cloudinary.com/dzgatscqu/video/upload/v1751128713/videoplayback_maiivz.mp4" type="video/mp4" />
            </video>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
          </div>
          {/* Content Overlay */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Create videos
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}without limits
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Transform your ideas into stunning videos instantly. No editing skills required. From marketing content to
              social media stories - bring any concept to life with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Try VideoAI Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create professional videos in just 3 simple steps with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-purple-600">1</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Describe Your Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Simply type what you want to create. Describe your video concept, style, and any specific
                    requirements in natural language.
                  </p>
                </CardContent>
              </Card>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-blue-600">2</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Magic Happens</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our advanced AI analyzes your request and generates stunning visuals, scenes, and animations
                    tailored to your specifications.
                  </p>
                </CardContent>
              </Card>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-indigo-600">3</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Download & Share</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Review, customize if needed, and download your professional video in high quality. Share it across
                    all your platforms instantly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTO Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-16 sm:px-10 text-center text-white relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to create your first video?</h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are already using AI to bring their ideas to life. Start your journey
                  today and see the magic happen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Creating Now
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-6 text-purple-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">3 free videos included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      {/* Features Section */}
      <section className="py-20 relative overflow-hidden ">
      <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why choose VideoAI?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of video creation with our cutting-edge AI technology
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Feature 1 */}
            <Card className="flex flex-col items-center justify-center border-0 shadow-2xl hover:shadow-purple-200 transition-shadow py-12 px-6 bg-white rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">AI-Powered Creativity</h3>
              <p className="text-lg text-gray-600 text-center">
                Unlock endless creative possibilities with advanced AI that understands your ideas and brings them to life in seconds.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="flex flex-col items-center justify-center border-0 shadow-2xl hover:shadow-purple-200 transition-shadow py-12 px-6 bg-white rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Personal Custom </h3>
              <p className="text-lg text-gray-600 text-center">
                Easily customize and personalize your video from AI-generated scripts. Add and modify content to fit your needs with just a few clicks.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="flex flex-col items-center justify-center border-0 shadow-2xl hover:shadow-purple-200 transition-shadow py-12 px-6 bg-white rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Star className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Export Anywhere</h3>
              <p className="text-lg text-gray-600 text-center">
                Download videos in multiple formats or publish directly to YouTube, TikTok, Facebook, and more with one click.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Background Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video Background 1 */}
            <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-full bg-black">
                <video
                  className="object-contain h-full w-full rounded-3xl"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  loop
                  poster="https://res.cloudinary.com/dzgatscqu/video/upload/v1751130066/video2_attp5t.jpg"
                >
                  <source src="https://res.cloudinary.com/dzgatscqu/video/upload/v1751130066/video2_attp5t.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
              </div>
              <div className="relative z-10 h-full flex items-center justify-center text-center px-8">
                <div>
                  <h3 className="font-extrabold text-3xl md:text-4xl text-white mb-4 leading-tight">
                    Multiple stock voices
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> and videos</span>
                  </h3>
                  <p className="text-lg text-gray-200 mb-4">
                    Access our vast library of premium stock content to enhance your AI-generated videos
                  </p>
                </div>
              </div>
            </div>
            {/* Video Background 2 */}
            <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-full bg-black">
                <video
                  className="object-contain h-full w-full rounded-3xl"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  loop
                  poster="https://res.cloudinary.com/ten_tai_khoan/video/upload/v1751129441/videoLandingPage_gkkto5.jpg"
                >
                  <source src="https://res.cloudinary.com/dzgatscqu/video/upload/v1751129441/videoLandingPage_gkkto5.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
              </div>
              <div className="relative z-10 h-full flex items-center justify-center text-center px-8">
                <div>
                  <h3 className="font-extrabold text-3xl md:text-4xl text-white mb-4 leading-tight">
                    AI-powered video creation
                  </h3>
                  <p className="text-lg text-gray-200 mb-4">
                    Let AI help you create stunning videos in minutes, not hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Users Think Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">What our users think</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-12">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Perfect for all skill levels</h3>
                  <p className="text-gray-600 leading-relaxed">
                    VideoAI is perfect for all skill levels. Ditch tools with steep learning curve and create videos
                    seamlessly with VideoAI.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">All-in-one AI video tool</h3>
                  <p className="text-gray-600 leading-relaxed">
                    This all-in-one AI video tool is a game-changer. It simplifying your video creation 
                    by combining everything you need into one intuitive platform, streamlining your workflow.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning-fast rendering</h3>
                  <p className="text-gray-600 leading-relaxed">
                           Get your finished videos in seconds, not hours. Our cloud-powered AI delivers high-quality results at incredible speed, so you never have to wait.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Testimonial slider */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                {/* Background decoration giữ nguyên */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-orange-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

                {/* Profile image */}
                <div className="flex justify-end mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src={testimonials[testimonialIdx].avatar}
                      alt={testimonials[testimonialIdx].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="relative">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    {testimonials[testimonialIdx].quote}
                  </div>
                  <footer className="flex items-center justify-between mb-6">
                    <cite className="text-lg font-semibold text-gray-700 not-italic">
                      {testimonials[testimonialIdx].name}
                    </cite>
                    <div className="flex gap-2">
                      <button
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors group"
                        onClick={prevTestimonial}
                        aria-label="Previous testimonial"
                      >
                        <svg className="w-5 h-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors group"
                        onClick={nextTestimonial}
                        aria-label="Next testimonial"
                      >
                        <svg className="w-5 h-5 text-gray-700  group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </footer>

                  {/* Capterra badge and rating */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 font-medium">{testimonials[testimonialIdx].badge}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-blue-500 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </blockquote>
              </div>

              {/* Floating elements giữ nguyên */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-200 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-200 rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-pink-200 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer/>
    </div>
  )
}
