# 📚 JSON Payload Library: Flow Node Configuration Cheatsheet

Role: **Senior Developer Advocate & Technical Writer**  
Context: **TechHub Premium Flow Configuration**

---

## 🎯 Introduction

The `payload` field is the "brain" of each Flow Node. It controls exactly what the user sees—from simple text to rich product carousels.

⚠️ **Important Note:** While Facebook Messenger supports almost all features, **Instagram has stricter limitations**. Specifically, Instagram Direct does not support PDFs or generic file downloads. Sending these will result in a flow error.

---

## 📊 Platform Compatibility Matrix

Use this matrix to ensure your automated flows work across all supported platforms.

| Feature | Facebook Messenger | Instagram Direct | Recommended Limit |
| :--- | :---: | :---: | :--- |
| **Simple Text** | ✅ | ✅ | Max 1000 characters |
| **Buttons** | ✅ | ✅ | Max 3 buttons |
| **Images (JPG/PNG)** | ✅ | ✅ | Max 8MB |
| **Video (MP4/MOV)** | ✅ | ✅ | Max 25MB |
| **Audio (AAC/WAV)** | ✅ | ❌ | Facebook Only |
| **Files (PDF/ZIP)** | ✅ | ❌ | Facebook Only |
| **Product Carousels** | ✅ | ✅ | Max 10 Cards |

---

## 📝 1. Simple Text Message

The most fundamental response type. Ideal for quick updates or welcome greetings.

*   **Constraint:** Text must be UTF-8 encoded.
*   **Best Practice:** Keep under 1000 characters for optimal mobile display.

### Example JSON
```json
{
  "text": "✨ Discover our curated collection of premium tech products. Ready to explore? 🚀"
}
```

---

## 🔘 2. Text with Interactive Buttons

Menus and navigation choices that guide users through your flow.

*   **Compatibility:** ✅ Both Instagram & Facebook.
*   **Constraint:** Max **3 Buttons** per message.
*   **Title Length:** Max **20 characters** (to avoid truncation on mobile screens).

### Example JSON (Welcome Menu)
```json
{
  "text": "🎉 Welcome to TechHub! What would you like to do?",
  "buttons": [
    {
      "type": "postback",
      "title": "🛍️ Show Products",
      "payload": "product_intro"
    },
    {
      "type": "web_url",
      "title": "🌐 Website",
      "url": "https://www.example.com"
    }
  ]
}
```

---

## 🎠 3. The Product Carousel (Generic Template)

A horizontal scrollable list of items, perfect for catalogs and showcases.

*   **Compatibility:** ✅ Both Instagram & Facebook.
*   **Constraint:** Max **10 Cards** (Elements) per carousel.
*   **Image Ratio:** **1.91:1** is strictly recommended for the best visual experience.

### Example JSON (TechHub Featured Products)
```json
{
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [
        {
          "title": "📷 Mirrorless Camera",
          "subtitle": "Professional photography. 4K video capability.",
          "image_url": "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
          "buttons": [
            { "type": "web_url", "url": "https://example.com/camera", "title": "🔗 Visit Product" },
            { "type": "postback", "title": "❤️ Add to Cart", "payload": "cart_camera" }
          ]
        },
        {
          "title": "🔊 Wireless Speaker",
          "subtitle": "360-degree immersive sound. 30h battery.",
          "image_url": "https://images.pexels.com/photos/1738641/pexels-photo-1738641.jpeg",
          "buttons": [
            { "type": "web_url", "url": "https://example.com/speaker", "title": "🔗 Visit Product" },
            { "type": "postback", "title": "📊 View Specs", "payload": "specs_speaker" }
          ]
        },
        {
          "title": "⌚ Smart Watch Pro",
          "subtitle": "Health and style combined. Retina display.",
          "image_url": "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
          "buttons": [
            { "type": "web_url", "url": "https://example.com/watch", "title": "🔗 Visit Product" },
            { "type": "postback", "title": "💵 Check Price", "payload": "price_watch" }
          ]
        }
      ]
    }
  }
}
```

---

## 🖼️ 4. Rich Media & Attachments (⚠️ STRICT LIMITS)

Standalone media files for high-impact communication.

### Format Guidelines

| Type | Formats | Max Size | Support |
| :--- | :--- | :--- | :--- |
| **Images** | JPG, PNG | 8MB | ✅ Both Platforms |
| **Videos** | MP4, MOV | 25MB | ✅ Both Platforms |
| **Audio** | AAC, M4A, WAV | 10MB | ⚠️ Facebook ONLY |
| **Files** | PDF, ZIP, DOC | 25MB | ⚠️ Facebook ONLY |

### Image Example
```json
{
  "attachment": {
    "type": "image",
    "payload": {
      "url": "https://your-server.com/image.jpg", 
      "is_reusable": true
    }
  }
}
```

> [!CAUTION]
> ### ⚠️ Instagram Warning
> **Instagram Direct DOES NOT support PDF documents or generic file downloads.** Sending these will result in an error and the message will fail to deliver. Use Facebook Messenger if file sharing is required.

---

## 💡 Pro Tips for Developers

*   **Navigation:** Always use `postback` buttons for app navigation (linking to other nodes using their `node_slug`).
*   **External Links:** Use `web_url` buttons for linking to your website, documentation, or social media.
*   **Fallback:** Always provide a text-based alternative if you are unsure of the user's platform capabilities.
*   **Testing:** Use the "Test Flow" feature to preview how carousels appear on mobile devices before going live.

---
**Happy Coding! 🚀**
