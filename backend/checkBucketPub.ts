import * as dotenv from 'dotenv';
dotenv.config();
import { supabase } from './src/db/supabase';

async function verifyAndSetPublic() {
    console.log("Checking bucket visibility...");

    const bucketsToFix = ["DevZeroImage", "DevZeroVideo"];

    for (const name of bucketsToFix) {
        const { data: bucket, error } = await supabase.storage.getBucket(name);

        if (error) {
            console.error(`Error fetching bucket ${name}:`, error.message);
            continue;
        }

        console.log(`Bucket ${name} public status:`, bucket.public);

        if (!bucket.public) {
            console.log(`Updating ${name} to be Public...`);
            const { error: updateError } = await supabase.storage.updateBucket(name, {
                public: true
            });

            if (updateError) {
                console.error(`Failed to update ${name} to public:`, updateError.message);
            } else {
                console.log(`✅ Successfully set ${name} to Public!`);
            }
        } else {
            console.log(`✅ ${name} is already Public!`);
        }
    }
}

verifyAndSetPublic();
