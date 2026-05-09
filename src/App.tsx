import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useRef, useEffect } from "react";

const SequenceBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalFrames = 155; // 0 to 154

  // Bu kapsayıcının (400vh) kaydırma yüzdesini takip ediyoruz
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);

  const drawImage = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Performans için alpha: false
    const img = imagesRef.current[index];

    if (!ctx || !img || !img.complete) return;

    // "object-contain" davranışı için hesaplamalar (Padding ile)
    const paddingX = canvas.width > 768 ? canvas.width * 0.05 : 0;
    const paddingY = canvas.height * 0.1; // Üstten ve alttan "baya" boşluk
    
    const maxDrawWidth = canvas.width - paddingX * 2;
    const maxDrawHeight = canvas.height - paddingY * 2;

    const imgRatio = img.width / img.height;
    const maxDrawRatio = maxDrawWidth / maxDrawHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > maxDrawRatio) {
      // Genişliğe göre sığdır
      drawWidth = maxDrawWidth;
      drawHeight = maxDrawWidth / imgRatio;
    } else {
      // Yüksekliğe göre sığdır
      drawHeight = maxDrawHeight;
      drawWidth = maxDrawHeight * imgRatio;
    }

    // Biraz sağa kaydırma ekle (sadece masaüstünde)
    // Ekran çok genişlediğinde kaydırma miktarını sınırla
    const effectiveWidth = Math.min(canvas.width, 1536);
    const isMobile = canvas.width <= 768;
    const shiftRight = isMobile ? 0 : effectiveWidth * 0.15; // Medyayı sağa kaydırma
    const shiftUp = isMobile ? canvas.height * 0.05 : 0; // Mobilde medya merkezini biraz yukarı al
    
    offsetX = (canvas.width - drawWidth) / 2 + shiftRight;
    offsetY = (canvas.height - drawHeight) / 2 - shiftUp;

    ctx.fillStyle = "#f3f5f7"; // Kullanıcının istediği arka plan rengi
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Beyaz arka planı alttaki renkle karıştırıp yok eden Blend Mode (Sihirli Kısım)
    ctx.globalCompositeOperation = "darken";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    // Canvas varsayılan moduna geri döndürülür
    ctx.globalCompositeOperation = "source-over";
  };

  // Resimleri önyükleme ve Canvas kurulumu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawImage(frameIndexRef.current);
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      // Tüm resimleri arka planda yükle
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = i === 0 ? "/A-Level_.webp" : `/A-Level__${i}.webp`;
        img.onload = () => {
          // Eğer ilk frame ise veya o sırada bulunduğumuz frame yüklenmişse çiz
          if (i === 0 || i === frameIndexRef.current) {
            drawImage(frameIndexRef.current);
          }
        };
        imagesRef.current[i] = img;
      }

      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, []);

  // Scroll değiştikçe Canvas'ı güncelle
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(latest * totalFrames))
    );
    if (frameIndex !== frameIndexRef.current) {
      frameIndexRef.current = frameIndex;
      requestAnimationFrame(() => drawImage(frameIndex));
    }
  });

  // Animasyon Değerleri: Yazılar için 
  // Belirli scroll aralıklarında yazılar gelip gidecek
  const text2Opacity = useTransform(scrollYProgress, [0, 0.12, 0.16, 1], [1, 1, 0, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0, 0.16, 0.20, 0.32, 0.36, 1], [0, 0, 1, 1, 0, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0, 0.36, 0.40, 0.52, 0.56, 1], [0, 0, 1, 1, 0, 0]);
  const text5Opacity = useTransform(scrollYProgress, [0, 0.56, 0.60, 0.72, 0.76, 1], [0, 0, 1, 1, 0, 0]);
  const text6Opacity = useTransform(scrollYProgress, [0, 0.76, 0.80, 0.92, 0.96, 1], [0, 0, 1, 1, 0, 0]);
  const text7Opacity = useTransform(scrollYProgress, [0, 0.96, 0.98, 1], [0, 0, 1, 1]);

  const text2Y = useTransform(scrollYProgress, [0, 0.12, 0.16, 1], [0, 0, -20, -20]);
  const text3Y = useTransform(scrollYProgress, [0, 0.16, 0.20, 0.32, 0.36, 1], [20, 20, 0, 0, -20, -20]);
  const text4Y = useTransform(scrollYProgress, [0, 0.36, 0.40, 0.52, 0.56, 1], [20, 20, 0, 0, -20, -20]);
  const text5Y = useTransform(scrollYProgress, [0, 0.56, 0.60, 0.72, 0.76, 1], [20, 20, 0, 0, -20, -20]);
  const text6Y = useTransform(scrollYProgress, [0, 0.76, 0.80, 0.92, 0.96, 1], [20, 20, 0, 0, -20, -20]);
  const text7Y = useTransform(scrollYProgress, [0, 0.96, 0.98, 1], [20, 20, 0, 0]);

  return (
    <section ref={containerRef} className="relative h-[700vh] bg-[#f3f5f7]">
      {/* Sticky Container: Ekrana yapışan ve animasyonların oynadığı alan */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center bg-[#f3f5f7]">
        
        {/* Çerçeve Görsel Sekansı (CANVAS) */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Max Width Container: Ekstra geniş ekranlarda text ve medya ayrışmasını engeller */}
        <div className="absolute inset-0 w-full max-w-[1600px] mx-auto h-full pointer-events-none">
          {/* Text 1: Sabit Ana Başlık (Eşit Hizalı ve Vurgulu A-Level) */}
          <div className="absolute w-full md:w-auto md:left-12 lg:left-20 top-[6%] sm:top-[8%] md:top-[12%] flex justify-center md:justify-start z-10 pointer-events-none">
            <div className="flex flex-col items-start w-fit pointer-events-auto">
              <h1 className="font-sans font-extrabold text-[#3843e9] text-[2.8rem] sm:text-[3.5rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] leading-[0.85] tracking-tight flex flex-col">
                <span className="text-[1.85em] tracking-[-0.04em]">Online</span>
                <motion.span 
                  className="text-[1.55em] inline-block tracking-[-0.03em]"
                  animate={{ 
                    color: ["#3843e9", "#00d2ff", "#3843e9"],
                    textShadow: [
                      "0px 0px 0px rgba(0, 210, 255, 0)", 
                      "0px 0px 25px rgba(0, 210, 255, 0.6)", 
                      "0px 0px 0px rgba(0, 210, 255, 0)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  A-Level
                </motion.span>
                <span className="text-[1em] tracking-[-0.02em]">Programme</span>
              </h1>
              <span className="text-gray-500 mt-2 md:mt-4 text-base sm:text-lg md:text-xl font-light tracking-tight drop-shadow-sm ml-1 md:ml-2">
                Ages from 16 to 19
              </span>
            </div>
          </div>

          {/* Lower Section Stack: Scroll Indicator, Description Text, Button */}
          <div className="absolute w-full md:w-[380px] lg:w-[480px] md:left-12 lg:left-20 bottom-[6%] sm:bottom-[8%] md:bottom-auto md:top-[48%] flex flex-col items-center md:items-start z-20 pointer-events-none">

            {/* Text Container (Fixed height to contain absolute items securely) */}
            <div className="w-full flex justify-center md:justify-start">
              <div className="relative w-full max-w-[85%] sm:max-w-[75%] md:max-w-none h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px]">
                
                {/* Texts 2 to 7 sharing the exact same layout structure */}
                <motion.div style={{ opacity: text2Opacity, y: text2Y }} className="absolute inset-0 text-left flex justify-center md:justify-start">
                  <h2 className="w-fit max-w-full font-sans font-bold text-[1.4rem] sm:text-3xl lg:text-4xl text-[#164ced] leading-[1.15] lg:leading-[1.1] tracking-tight drop-shadow-sm pointer-events-auto">
                    IWS Online School<br />provides a world-class<br />A-Level programme
                  </h2>
                </motion.div>
                
                <motion.div style={{ opacity: text3Opacity, y: text3Y }} className="absolute inset-0 text-left flex justify-center md:justify-start">
                  <h2 className="w-fit max-w-full font-sans font-bold text-[1.4rem] sm:text-3xl lg:text-4xl text-[#164ced] leading-[1.15] lg:leading-[1.1] tracking-tight drop-shadow-sm pointer-events-auto">
                    designed to prepare<br />students for<br />university and<br />beyond.
                  </h2>
                </motion.div>

                <motion.div style={{ opacity: text4Opacity, y: text4Y }} className="absolute inset-0 text-left flex justify-center md:justify-start">
                  <h2 className="w-fit max-w-full font-sans font-bold text-[1.4rem] sm:text-3xl lg:text-4xl text-[#164ced] leading-[1.15] lg:leading-[1.1] tracking-tight drop-shadow-sm pointer-events-auto">
                    Our comprehensive<br />and flexible<br />curriculum
                  </h2>
                </motion.div>

                <motion.div style={{ opacity: text5Opacity, y: text5Y }} className="absolute inset-0 text-left flex justify-center md:justify-start">
                  <h2 className="w-fit max-w-full font-sans font-bold text-[1.4rem] sm:text-3xl lg:text-4xl text-[#164ced] leading-[1.15] lg:leading-[1.1] tracking-tight drop-shadow-sm pointer-events-auto">
                    empowers learners to<br />develop advanced<br />knowledge,
                  </h2>
                </motion.div>

                <motion.div style={{ opacity: text6Opacity, y: text6Y }} className="absolute inset-0 text-left flex justify-center md:justify-start">
                  <h2 className="w-fit max-w-full font-sans font-bold text-[1.4rem] sm:text-3xl lg:text-4xl text-[#164ced] leading-[1.15] lg:leading-[1.1] tracking-tight drop-shadow-sm pointer-events-auto">
                    critical thinking skills,<br />and subject mastery,
                  </h2>
                </motion.div>

                <motion.div style={{ opacity: text7Opacity, y: text7Y }} className="absolute inset-0 text-left flex justify-center md:justify-start">
                  <h2 className="w-fit max-w-full font-sans font-bold text-[1.4rem] sm:text-3xl lg:text-4xl text-[#164ced] leading-[1.15] lg:leading-[1.1] tracking-tight drop-shadow-sm mb-0 md:mb-8 pointer-events-auto">
                    ensuring success in<br />higher education and<br />future careers.
                  </h2>
                </motion.div>
              </div>
            </div>

            {/* Buton Grubu (Sol Altta) */}
            <div className="w-full flex justify-center md:justify-start pointer-events-auto mt-4 md:mt-8">
              <motion.a 
                href="https://www.iwsonlineschool.co.uk/contact-us" 
                target="_top" 
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#164ced] text-white font-medium text-base sm:text-lg rounded-full overflow-hidden shadow-xl shadow-[#164ced]/30 border border-[#164ced]/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animasyonlu İç Katman (Parlayan Şerit) */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                  initial={{ x: "-150%" }}
                  animate={{ x: "150%" }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                />
                {/* Dış çember puls efekti */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#164ced]/50 pointer-events-none"
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="relative z-10">Enquire Now</span>
                <svg className="relative z-10 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </motion.a>
            </div>
            
          </div>
        </div> {/* Max Width Container Bitiş */}
      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="bg-[#f3f5f7] text-gray-900 selection:bg-[#164ced] selection:text-white font-sans antialiased">
      <SequenceBanner />
    </div>
  );
}
