"use client";
// pages/about-us.js
import { useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';

export default function AboutUs() {
  // References for scroll animations
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const impactRef = useRef(null);
  
  // InView hooks for animations
  const isHeroInView = useInView(heroRef, { once: true });
  const isStoryInView = useInView(storyRef, { once: true });
  const isValuesInView = useInView(valuesRef, { once: true });
  const isTeamInView = useInView(teamRef, { once: true });
  const isImpactInView = useInView(impactRef, { once: true });
  
  // Parallax effect for hero section
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <Head>
        <title>About Us | Elastica</title>
        <meta name="description" content="Elastica - Where innovation meets sustainability. Learn about our story, values, and impact." />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

     
     

      {/* Our Story Section */}
      <section ref={storyRef} className="py-10 md:py-10 px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Image 
                // src="/images/elastica.png" 
                src="/images/ELASTICA_Logo.jpg" 
                alt="Elastica production process" 
                width={600} 
                height={800} 
                className="rounded-xl shadow-xl" 
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="w-20 h-1 bg-[#22c55e] mb-8"></div>
              <p className="text-lg text-neutral-600 mb-6">
                Elastica was born from a vision to transform the rubber industry through sustainable practices and innovative design. Founded in 2020, our journey began with a simple question: How can we create beautiful, functional products while minimizing environmental impact?
              </p>
              <p className="text-lg text-neutral-600 mb-6">
                Backed by expert rubber technologists and crafted with care by empowered women artisans, we've created a range that spans from elegant home planters to performance-oriented fitness accessories and pet-friendly toys.
              </p>
              <p className="text-lg text-neutral-600">
                Every Elastica product embodies our commitment to sustainability, quality, and social responsibility. We source responsibly, manufacture mindfully, and deliver exceptionally.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section ref={valuesRef} className="py-20 md:py-32 px-8 bg-neutral-100">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Elastica Difference</h2>
            <div className="w-20 h-1 bg-[#22c55e] mx-auto mb-8"></div>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our core values guide everything we do, from design and production to customer service and community engagement.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Women Empowerment",
                description: "We provide training, fair wages, and growth opportunities for women artisans in our production facilities.",
                icon: "👩‍🎨"
              },
              {
                title: "Sustainability",
                description: "From sourcing to packaging, every decision is made with environmental responsibility in mind.",
                icon: "🌱"
              },
              {
                title: "Quality",
                description: "Meticulous attention to detail and rigorous testing ensure products that exceed expectations.",
                icon: "✨"
              },
              {
                title: "Compassion",
                description: "We believe in creating products and a workplace that promotes wellbeing for all.",
                icon: "❤️"
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-[#22c55e]">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section ref={teamRef} className="py-20 md:py-32 px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Artisans</h2>
            <div className="w-20 h-1 bg-[#22c55e] mx-auto mb-8"></div>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              The talented individuals who bring Elastica products to life through their expertise, creativity, and dedication.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isTeamInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <Image 
                    src={`/api/placeholder/400/${400 + index * 10}`} 
                    alt="Team member" 
                    width={400} 
                    height={400 + index * 10} 
                    className="w-full" 
                  />
                  <motion.div 
                    className="absolute inset-0 bg-[#22c55e]/80 flex items-center justify-center opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-white text-center p-6">
                      <p className="font-medium mb-2">Our Expert Artisans</p>
                      <div className="flex justify-center space-x-4 mt-4">
                        {/* Social icons would go here */}
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section ref={impactRef} className="py-20 md:py-32 px-8 bg-[#22c55e]/10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isImpactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact</h2>
              <div className="w-20 h-1 bg-[#22c55e] mb-8"></div>
              <p className="text-lg text-neutral-600 mb-6">

              Elastica aims to reduce the burden of industrial rubber flash scrap which would otherwise end up as landfill.
              </p>
              
              <div className="space-y-6">
                {[
                  { metric: "60%", description: "Elastica aims to create awareness regarding the potential and possibilities associated with recycling and repurposing waste." },
                  { metric: "100+", description: "Elastica is focused in encouraging women towards meaningful employment." },
                  { metric: "5 tons", description: "Elastica is dedicated to research and development of new designs and innovative production of products using industrial scrap." },
                  { metric: "15,000+", description: "Trees planted through our reforestation initiative" }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isImpactInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    {/* <div className="text-2xl font-bold text-[#22c55e] mr-4">{item.metric}</div> */}
                    <div className="text-2xl font-bold text-[#22c55e] mr-4">🍀</div>
                    <p className="text-neutral-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                className="mt-8 border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read Our Sustainability Report
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isImpactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="/images/impact.png" 
                alt="Elastica impact visualization" 
                width={600} 
                height={600} 
                className="rounded-xl shadow-xl" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        className="py-20 md:py-32 px-8 bg-[#22c55e]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join Our Sustainable Journey</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover our collection of eco-conscious rubber products and be part of the movement towards a more sustainable future.
          </p>
          <Link href="/">
          <motion.button 
            className="bg-white text-[#22c55e] px-8 py-3 rounded-full font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.button>
          </Link>
        </div>
      </motion.section>

     
    </div>
  );
}