require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const { Book } = require("./models/book");

async function importGoogleBooksDirect() {
  try {
    if (!process.env.DB) {
      throw new Error("Zmienna DB nie jest zdefiniowana w pliku .env");
    }
    if (!process.env.GOOGLE_BOOKS_API_KEY) {
      throw new Error("Zmienna GOOGLE_BOOKS_API_KEY nie jest zdefiniowana w pliku .env. GOOGLE_BOOKS_API_KEY не визначена в .env файлі");
    }

    console.log("DB URI:", process.env.DB);
    await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
    });
    console.log("Połączony z bazą danych");

    

    try {
      await Book.collection.createIndex({ isbn: 1 }, { unique: true, sparse: true });
      await Book.collection.createIndex(
        { title: "text", author: "text" },
        { name: "title_author_text" }
      );
      console.log("Indeksy utworzone lub już istniejące");
    } catch (indexError) {
      console.error("Błąd podczas pracy z indeksem:", indexError.message);
    }

    const searchQueries = [
      "subject:Fantasy",
      "subject:Science Fiction",
      "subject:Fiction",
      "subject:Biography",
      "subject:History",
      "subject:Young Adult",
      "subject:Mystery",
      "subject:Romance",
      "bestseller",
      "award-winning books",
    ];

    let count = 0;
    let skipped = 0;
    const batchSize = 50;
    let batch = [];
    const maxBooks = 1000; 

    for (const query of searchQueries) {
      console.log(`Wyszukujemy na życzenie: ${query}`);
      let startIndex = 0;
      const maxResults = 40; 

      while (startIndex < 200) { 
        try {
          const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
          );

          const items = response.data.items || [];
          if (!items.length) {
            console.log(`Brak dalszych wyników dla ${query}`);
            break;
          }

          for (const item of items) {
            const volume = item.volumeInfo;
            if (!volume.title || !volume.authors) {
              skipped++;
              continue;
            }

            const isbn = volume.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier ||
                         volume.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier || "";
            const title = volume.title?.trim().toLowerCase();
            const author = volume.authors?.join(", ")?.trim().toLowerCase();

            
            const query = isbn
              ? { isbn }
              : {
                  $text: {
                    $search: `"${title}" "${author}"`,
                    $caseSensitive: false,
                  },
                };
            const existingBook = await Book.findOne(query);
            if (existingBook) {
              console.log(`Książka już istnieje: ${volume.title} (ISBN: ${isbn || "немає"})`);
              skipped++;
              continue;
            }

            batch.push({
              title: volume.title || "Bez tytułu",
              author: volume.authors?.join(", ") || "Autor nieznany",
              isbn: isbn || "",
              publishedYear: parseInt(volume.publishedDate?.split("-")[0]) || null,
              genre: volume.categories?.[0] || "",
              description: volume.description || "",
              coverImage: volume.imageLinks?.thumbnail || "",
            });

            if (batch.length >= batchSize) {
              try {
                await Book.insertMany(batch, { ordered: false });
                count += batch.length;
                console.log(`✅ Dodano pakiet z ${batch.length} książek`);
                batch = [];
              } catch (batchError) {
                console.error(`Błąd dodawania pakietu:`, batchError.message);
                skipped += batch.length;
                batch = [];
              }
            }

            if (count >= maxBooks) {
              console.log(`Osiągnięto limit importu (${maxBooks} książek)`);
              return;
            }
          }

          startIndex += maxResults;
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Błąd podczas żądania ${query}:`, error.message);
          skipped += items?.length || 0;
          break;
        }
      }
    }

    if (batch.length > 0) {
      try {
        await Book.insertMany(batch, { ordered: false });
        count += batch.length;
        console.log(`Dodano pakiet szczątkowy z ${batch.length} książek`);
      } catch (batchError) {
        console.error(`Błąd podczas wkładania pozostałego pakietu:`, batchError.message);
        skipped += batch.length;
      }
    }

    console.log(`Dodano pomyślnie ${count} książek`);
    console.log(`Brakuje ${skipped} książek`);
  } catch (error) {
    console.error("Błąd importu:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Odłączono od bazy danych");
  }
}

importGoogleBooksDirect();  