import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { contentTypes, prompt, channels } = await request.json()

    // Simulate AI content generation
    const generatedContent = contentTypes.map((type: string, index: number) => {
      const contentMap: { [key: string]: any } = {
        posts: {
          id: `post_${Date.now()}_${index}`,
          type: "Social Media Post",
          title: "Delicious Weekend Special",
          content: {
            text: "🍽️ Weekend Special Alert! Our chef's signature butter chicken with aromatic basmati rice is now available. Made with fresh ingredients and traditional spices. Perfect for family dining! 👨‍👩‍👧‍👦",
            caption:
              "Weekend vibes call for special flavors! Try our chef's signature butter chicken - a perfect blend of tradition and taste. Book your table now! 📞",
            hashtags: ["#WeekendSpecial", "#ButterChicken", "#FamilyDining", "#AuthenticFlavors", "#BookNow"],
            callToAction: "Book your table now! Call us or visit our website.",
          },
          channels: channels || ["Instagram", "Facebook"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        stories: {
          id: `story_${Date.now()}_${index}`,
          type: "Instagram Story",
          title: "Behind the Scenes Kitchen",
          content: {
            text: "Take a peek into our kitchen! Watch our chef prepare the weekend special with love and traditional techniques. Swipe up to book your table! 👆",
            hashtags: ["#BehindTheScenes", "#ChefSpecial", "#FreshIngredients"],
            callToAction: "Swipe up to book your table!",
          },
          channels: channels || ["Instagram"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        carousels: {
          id: `carousel_${Date.now()}_${index}`,
          type: "Carousel Post",
          title: "Menu Highlights Carousel",
          content: {
            text: "Discover our signature dishes! Slide through our most popular items and find your next favorite meal.",
            caption:
              "From appetizers to desserts, every dish tells a story of authentic flavors and fresh ingredients. Which one will you try first?",
            hashtags: ["#MenuHighlights", "#SignatureDishes", "#AuthenticFlavors", "#FreshIngredients"],
            callToAction: "Visit us today and taste the difference!",
          },
          channels: channels || ["Instagram", "Facebook"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        qr_codes: {
          id: `qr_${Date.now()}_${index}`,
          type: "QR Code",
          title: "Digital Menu QR Code",
          content: {
            text: "Scan to view our complete digital menu with prices and ingredients. Contactless and convenient!",
            design: "Modern black and white QR code with restaurant logo",
            callToAction: "Scan to view our digital menu",
          },
          channels: channels || ["Website", "Instagram"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        menu_highlights: {
          id: `menu_${Date.now()}_${index}`,
          type: "Menu Highlight",
          title: "Chef's Special Biryani",
          content: {
            text: "🍛 Chef's Special Biryani - A royal feast of aromatic basmati rice layered with tender meat and exotic spices. Served with raita and shorba. Limited time offer!",
            caption:
              "Experience the royal taste of our Chef's Special Biryani. Each grain of rice is infused with authentic spices and cooked to perfection.",
            hashtags: ["#ChefSpecial", "#Biryani", "#RoyalFeast", "#LimitedOffer", "#AuthenticSpices"],
            callToAction: "Order now - Limited time offer!",
          },
          channels: channels || ["Instagram", "WhatsApp"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        offer_cards: {
          id: `offer_${Date.now()}_${index}`,
          type: "Offer Card",
          title: "Weekend Family Discount",
          content: {
            text: "🎉 Weekend Family Special! Get 20% off on orders above ₹1500. Valid for dine-in and takeaway. Bring your family and enjoy authentic flavors at unbeatable prices!",
            caption: "Weekend calls for family time and great food! Enjoy 20% off on your family meal this weekend.",
            hashtags: ["#WeekendOffer", "#FamilyDiscount", "#20PercentOff", "#DineIn", "#Takeaway"],
            callToAction: "Visit us this weekend and save 20%!",
          },
          channels: channels || ["Instagram", "WhatsApp", "SMS"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        testimonials: {
          id: `testimonial_${Date.now()}_${index}`,
          type: "Customer Testimonial",
          title: "Happy Customer Review",
          content: {
            text: "⭐⭐⭐⭐⭐ 'Amazing food and excellent service! The butter chicken was absolutely delicious and the staff was very friendly. Will definitely come back!' - Priya S.",
            caption:
              "Nothing makes us happier than satisfied customers! Thank you Priya for your wonderful review. We look forward to serving you again!",
            hashtags: ["#HappyCustomers", "#5StarReview", "#ExcellentService", "#DeliciousFood"],
            callToAction: "Share your experience with us!",
          },
          channels: channels || ["Instagram", "Facebook"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        reels: {
          id: `reel_${Date.now()}_${index}`,
          type: "Reel Script",
          title: "Cooking Process Reel",
          content: {
            text: "🎬 Reel Script: 'From Kitchen to Table' - Show the journey of our signature dish from preparation to plating. Include close-ups of spices, cooking process, and final presentation.",
            caption:
              "Behind every delicious meal is a story of passion, tradition, and fresh ingredients. Watch our chefs create magic in the kitchen!",
            hashtags: ["#BehindTheScenes", "#CookingProcess", "#FreshIngredients", "#ChefMagic"],
            callToAction: "Follow for more kitchen stories!",
          },
          channels: channels || ["Instagram", "YouTube"],
          status: "generated",
          createdAt: new Date().toISOString(),
        },
      }

      return contentMap[type] || contentMap.posts
    })

    return NextResponse.json({
      success: true,
      content: generatedContent,
      message: `Generated ${generatedContent.length} pieces of content`,
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate content",
      },
      { status: 500 },
    )
  }
}
