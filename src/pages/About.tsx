import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              About FormVerse
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              India's first launchpad for CAD creators. We're revolutionizing how designers turn their creativity into capital.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    FormVerse empowers CAD creators across India to monetize their design skills and connect with businesses that need high-quality 3D models and engineering solutions.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    We bridge the gap between talented designers and companies looking for custom CAD solutions, creating a thriving ecosystem where creativity meets commerce.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
                  <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become the leading platform for CAD creators globally, fostering innovation and enabling designers to build sustainable careers through their technical expertise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                  <p className="text-muted-foreground">
                    Continuously pushing boundaries with cutting-edge technology and creative solutions.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community</h3>
                  <p className="text-muted-foreground">
                    Building a supportive ecosystem where creators collaborate and grow together.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                  <p className="text-muted-foreground">
                    Committed to delivering the highest quality platform and user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="mb-6">
                  FormVerse was born from a simple observation: India has an abundance of talented CAD professionals and engineering students, but limited platforms to showcase and monetize their skills effectively.
                </p>
                <p className="mb-6">
                  Founded by a team of engineers and designers who experienced this challenge firsthand, FormVerse bridges the gap between creative talent and market demand. We understand the unique needs of both creators seeking opportunities and businesses requiring specialized CAD solutions.
                </p>
                <p>
                  Today, we're proud to be India's premier platform for CAD creators, fostering innovation and enabling designers to build sustainable careers through their technical expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Join the FormVerse Community</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a creator looking to monetize your skills or a business seeking CAD solutions, we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                Start Creating
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                Find Models
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}