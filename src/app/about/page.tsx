import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Globe, Lightbulb, Shield, Target } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously pushing the boundaries of biomedical technology through R&D excellence.",
    },
    {
      icon: Shield,
      title: "Quality",
      description: "Uncompromising commitment to quality, safety, and regulatory compliance.",
    },
    {
      icon: Users,
      title: "Patient-Centric",
      description: "Designing with the end goal of improving patient outcomes and quality of life.",
    },
    {
      icon: Target,
      title: "Precision",
      description: "Engineering devices with accuracy and reliability as core principles.",
    },
  ]

  const certifications = [
    {
      title: "FDA 510(k) Clearance",
      description: "Multiple devices cleared by the U.S. Food and Drug Administration",
      icon: Award,
    },
    {
      title: "ISO 13485:2016",
      description: "Medical devices quality management system certification",
      icon: Award,
    },
    {
      title: "CE Mark",
      description: "European conformity certification for medical devices",
      icon: Award,
    },
    {
      title: "MDSAP",
      description: "Medical Device Single Audit Program certified",
      icon: Award,
    },
    {
      title: "ISO 9001:2015",
      description: "Quality management system standard",
      icon: Award,
    },
    {
      title: "HIPAA Compliant",
      description: "Health Insurance Portability and Accountability Act certified",
      icon: Award,
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      bio: "Former Director of Biomedical Engineering at Johns Hopkins, 20+ years in medical device innovation.",
    },
    {
      name: "Michael Rodriguez, PhD",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      bio: "Ph.D. in Biomedical Engineering from MIT, specialist in AI-powered diagnostic systems.",
    },
    {
      name: "Dr. Emily Watson",
      role: "VP of Clinical Affairs",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      bio: "Board-certified cardiologist with extensive experience in medical device clinical trials.",
    },
    {
      name: "James Park",
      role: "VP of Regulatory Affairs",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
      bio: "Expert in FDA regulations and international medical device compliance with 15+ years experience.",
    },
  ]

  const expertise = [
    "Cardiac Monitoring Systems",
    "Medical Imaging Technology",
    "Patient Vital Signs Monitoring",
    "Neurological Diagnostics",
    "Respiratory Function Analysis",
    "Point-of-Care Testing",
    "Telemedicine Integration",
    "AI/ML in Healthcare",
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge className="mb-2">About BioMedTech</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Innovating Healthcare Through Technology
            </h1>
            <p className="text-lg text-muted-foreground">
              For over two decades, we've been at the forefront of biomedical device innovation, transforming patient care worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Company Background */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=80"
                alt="BioMedTech facility"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2003, BioMedTech emerged from a simple yet powerful vision: to bridge the gap between 
                  cutting-edge technology and accessible healthcare. What began as a small team of biomedical engineers 
                  in Boston has grown into a global leader in medical device innovation.
                </p>
                <p>
                  Today, our devices are used in over 5,000 healthcare facilities across 45 countries, helping 
                  healthcare professionals deliver better patient outcomes every day. We've pioneered numerous 
                  breakthrough technologies, from AI-powered cardiac monitoring to advanced diagnostic imaging systems.
                </p>
                <p>
                  Our commitment to innovation is matched only by our dedication to quality and safety. Every device 
                  we create undergoes rigorous testing and validation, ensuring it meets the highest standards of 
                  regulatory compliance and clinical effectiveness.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">20+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5,000+</div>
                  <div className="text-sm text-muted-foreground">Facilities Worldwide</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our innovation and define our commitment to healthcare excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <value.icon className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Areas of Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our specialized domains of biomedical device development and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {expertise.map((area, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <p className="font-medium">{area}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Regulatory Certifications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to quality and safety is validated by industry-leading certifications and approvals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <cert.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-2">{cert.title}</CardTitle>
                      <CardDescription>{cert.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the experts driving innovation and excellence at BioMedTech.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{member.role}</Badge>
                  <CardDescription className="text-sm pt-2">{member.bio}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Globe className="h-16 w-16 mx-auto opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold">Global Presence, Local Impact</h2>
            <p className="text-lg opacity-90">
              With headquarters in Boston and offices in London, Singapore, and Tokyo, we're positioned to serve 
              healthcare providers worldwide. Our 24/7 support team ensures that medical professionals always have 
              the assistance they need, whenever they need it.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
