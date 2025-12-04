import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, HeartPulse, Microscope, Stethoscope, Zap, Shield, Award } from "lucide-react"

export default function Home() {
  const featuredDevices = [
    {
      title: "CardioMonitor Pro",
      category: "Cardiac Monitoring",
      description: "Advanced ECG monitoring system with real-time analysis and AI-powered anomaly detection.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      icon: HeartPulse,
    },
    {
      title: "DiagnoScan X2",
      category: "Medical Imaging",
      description: "High-resolution diagnostic imaging device for early disease detection and precision medicine.",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&q=80",
      icon: Microscope,
    },
    {
      title: "VitalTrack Plus",
      category: "Patient Monitoring",
      description: "Continuous vital signs monitoring with cloud integration and smart alerts.",
      image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80",
      icon: Stethoscope,
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "FDA Approved",
      description: "All devices meet rigorous FDA standards for safety and efficacy.",
    },
    {
      icon: Zap,
      title: "Cutting-Edge Technology",
      description: "Leveraging AI and IoT for advanced diagnostic capabilities.",
    },
    {
      icon: Award,
      title: "ISO Certified",
      description: "ISO 13485:2016 certified manufacturing and quality management.",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="w-fit">Advancing Healthcare Technology</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Pioneering Innovation in{" "}
                <span className="text-primary">Biomedical Devices</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Transforming patient care through precision-engineered medical devices. 
                Our cutting-edge technology empowers healthcare professionals worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/devices">
                    Explore Our Devices <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Request Information</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80"
                alt="Medical device technology"
                fill
                className="object-cover rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Devices Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Technology</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Devices</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our flagship biomedical devices designed to enhance diagnostic accuracy and patient outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDevices.map((device, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={device.image}
                    alt={device.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <device.icon className="h-5 w-5 text-primary" />
                    <Badge variant="secondary">{device.category}</Badge>
                  </div>
                  <CardTitle>{device.title}</CardTitle>
                  <CardDescription className="text-base">
                    {device.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/devices">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/devices">
                View All Devices <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              At BioMedTech, we are committed to advancing healthcare through innovative biomedical device solutions. 
              Our mission is to empower healthcare professionals with precision-engineered, reliable medical technology 
              that improves patient outcomes and transforms the future of diagnostics and treatment.
            </p>
            <p className="text-base md:text-lg opacity-80">
              With over 20 years of experience and a team of world-class engineers and medical experts, 
              we continue to push the boundaries of what's possible in medical device innovation.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-4">
              <Link href="/about">Learn About Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Ready to Transform Your Practice?</h2>
                  <p className="text-muted-foreground text-lg">
                    Get in touch with our team to learn how our biomedical devices can enhance your healthcare delivery.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
                  <Button asChild size="lg">
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/devices">Browse Catalog</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}