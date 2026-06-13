import { OpenAI } from "openai";

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: "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",
});

async function testAI(testUrl: string) {
    const chatCompletion = await client.chat.completions.create({
        model: "Qwen/Qwen3.5-35B-A3B:novita",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `In ONE WORD does the image classify as a wood/ceramic/textile/leather/metal product.
                            return only the choices given.`,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: "https://british-ironworks.b-cdn.net/shop/media/catalog/product/cache/eff350442bf2cfa51958692118d474e8/t/o/toilet_tales_scrap_metal_art_sculpture.jpg",
                        },
                    },
                ],
            },
        ],
    });
    const result = chatCompletion.choices[0].message.content;
    console.log(result?.trim().toLowerCase());
}

// Test URLs
const testUrls = [
    "https://jlceramics.nl/wp-content/uploads/2025/03/JLCeramics_Blog_What-Ceramics-Are-Made-From_v1.1-1.webp", //CERAMIC
    "https://ishaexportimport.com/wp-content/uploads/2024/07/Ceramic-Mug.jpg", //CERAMIC
    "https://market99.com/cdn/shop/files/WW10006610-1_5745b2e5-9704-4009-9036-300874c062d1.jpg?crop=center&height=1650&v=1749627193&width=1500", // CERAMIC
    "https://image.invaluable.com/housePhotos/districtauction/50/808750/H19179-L430450221.jpg", // CERAMIC
    "https://www.houseofceramics.in/cdn/shop/files/Golden_Daisy_Handcrafted_Premium_Dinner_Set.jpg?v=1753035354&width=3840", // CERAMIC
    "https://mytype.store/cdn/shop/files/DSC00575.jpg?v=1758694874&width=533", // WOOD
    "https://www.woodsajawat.com/cdn/shop/collections/BDWU003.jpg?v=1692018098&width=1500", // Wood
    "https://www.squarencircle.com/uploaded-files/category/images/thumbs/wooden-products-thumbs-500x500-v1770194734.webp", // Wood
    "https://www.kulturafilipino.com/cdn/shop/products/IMG5152_1080x.jpg?v=1627873669", // Wood
    "https://morataara.com/cdn/shop/articles/Wooden_Decor_Banner_Hor.jpg?v=1718368621", // Wood
    "https://specialtyfabricsreview.com/wp-content/uploads/sites/28/2020/01/fabric_swatches1-1024x682.jpg", // Textile
    "https://india.entrepreneur.com/wp-content/uploads/sites/5/2023/01/1673409909-Hithere2.jpg", // textile
    "https://deltatextilesolutions.com/wp-content/uploads/2025/07/textile-materials.jpg", // Textile
    "https://svarna.com/wp-content/uploads/2025/08/Tradition-meets-trend-The-rise-of-sustainable-handmade-textile-products.webp", // Textile
    "https://study.com/cimages/videopreview/qpb8l0logb.jpg", // Textile
    "https://buffalojackson.com/cdn/shop/products/Roosevelt_Buffalo_Leather_Satchel_Messenger_Bag_Dark_Oak_1-copy_900x900_crop_center.jpg?v=1623335044", // Leather
    "https://www.thejacketmaker.cl/cdn/shop/files/ThePrestonVintageTanLeatherBriefcaseFront_2048x.jpg?v=1760635759", // Leather
    "https://cdn.shopify.com/s/files/1/0588/1492/2946/files/product-jpeg-500x500_6828566b-17ba-4748-b7ec-d347c2b9b86f_480x480.jpg?v=1651229204", // Leather
    "https://www.mayuruniquoters.com/products/LEATHER4/product-4_xl.jpg", // Leather
    "https://kurbanglokal.com/cdn/shop/files/CROCOTAN1_c8e48829-6d25-477e-a40a-005d28edc085.jpg?v=1750344144&width=533", // Leather
    "https://i.pinimg.com/736x/13/9f/eb/139feb6c54b37eb662c140799b01cf93.jpg", // Undefined
    "https://kalifano.com/cdn/shop/collections/5.jpg?v=1697846052&width=2048", // Undefined
    "https://i.pinimg.com/736x/71/db/ed/71dbedec5c578213200309bc5dbcbae4.jpg", // 
    "https://www.artsyshark.com/wp-content/uploads/2019/12/Simplex-Fish-Reclaimed-Metal-Sculpture-26x7x16.jpg", // Undefined
    "https://british-ironworks.b-cdn.net/shop/media/catalog/product/cache/eff350442bf2cfa51958692118d474e8/t/o/toilet_tales_scrap_metal_art_sculpture.jpg" // Metal
]

// Run it
testAI(testUrls[1]);
