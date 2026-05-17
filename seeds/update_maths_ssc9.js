const mongoose = require('mongoose');

async function seedMaths() {
  const MONGO_URI = 'mongodb://localhost:27017/syllabus';
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('ssc9');

    const mathsData = {
      grade: 9,
      subject: 'Mathematics',
      units: [
        { name: "Real Numbers – June", url: "https://www.youtube.com/embed/IMnSIaPcqiE" },
        { name: "Polynomials and Factorisation – June/July", url: "https://www.youtube.com/embed/4VHrvMutJQw" },
        { name: "The Elements of Geometry – July", url: "https://www.youtube.com/embed/mxeXcTjQiuM" },
        { name: "Lines and Angles – August", url: "https://www.youtube.com/embed/nEYldznpZmk" },
        { name: "Co-Ordinate Geometry – December", url: "https://www.youtube.com/embed/CEF-IN3HMgk" },
        { name: "Linear Equations in Two Variables – August/September", url: "https://www.youtube.com/embed/rnudiJxVXxM" },
        { name: "Triangles – October/November", url: "https://www.youtube.com/embed/wIeiqvdVCJI" },
        { name: "Quadrilaterals – November", url: "https://www.youtube.com/embed/STrfPXdTzUA" },
        { name: "Statistics – July", url: "https://www.youtube.com/embed/cqDnrYcekWI" },
        { name: "Surface Areas and Volumes – September", url: "https://www.youtube.com/embed/CqkDFwAZlC4" },
        { name: "Areas – December", url: "https://www.youtube.com/embed/MC1b3FBDxy0" },
        { name: "Circles – January", url: "https://www.youtube.com/embed/mCWjZ5q58u8" },
        { name: "Geometrical Constructions – February", url: "https://www.youtube.com/embed/btVqpqEZpYI" },
        { name: "Probability – February", url: "https://www.youtube.com/embed/_XT6d6d8J5Q" },
        { name: "Proofs in Mathematics", url: "https://www.youtube.com/embed/zZBbQnCahto" }
      ]
    };

    // Update or Insert
    const result = await collection.updateOne(
      { grade: 9, subject: 'Mathematics' },
      { $set: mathsData },
      { upsert: true }
    );

    console.log('Successfully updated Class 9 SSC Mathematics chapters.');
    console.log('Modified Count:', result.modifiedCount, 'Upserted Count:', result.upsertedCount);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedMaths();
