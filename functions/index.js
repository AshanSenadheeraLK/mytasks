const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const EXPIRY_HOURS = 12;

/**
 * Scheduled function that runs every hour to delete messages older than 12 hours
 */
exports.cleanupExpiredMessages = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    console.log('Starting cleanup of expired messages...');
    
    // Calculate timestamp for messages older than 12 hours
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() - EXPIRY_HOURS);
    
    try {
      // Query for messages older than the expiry time
      const expiredMessagesQuery = db.collection('messages')
        .where('createdAt', '<', expiryTime);
      
      const expiredMessagesSnapshot = await expiredMessagesQuery.get();
      
      if (expiredMessagesSnapshot.empty) {
        console.log('No expired messages to delete.');
        return null;
      }
      
      // Delete expired messages in batches
      const batchSize = 500;
      const batches = [];
      let currentBatch = db.batch();
      let operationCounter = 0;
      
      expiredMessagesSnapshot.docs.forEach((doc) => {
        currentBatch.delete(doc.ref);
        operationCounter++;
        
        if (operationCounter >= batchSize) {
          batches.push(currentBatch.commit());
          currentBatch = db.batch();
          operationCounter = 0;
        }
      });
      
      if (operationCounter > 0) {
        batches.push(currentBatch.commit());
      }
      
      await Promise.all(batches);
      console.log(`Deleted ${expiredMessagesSnapshot.size} expired messages.`);
      
      // Clean up empty conversations
      await cleanupEmptyConversations();
      
      return null;
    } catch (error) {
      console.error('Error cleaning up expired messages:', error);
      return null;
    }
  });

/**
 * Helper function to clean up conversations with no messages
 */
async function cleanupEmptyConversations() {
  try {
    // Get all conversations
    const conversationsSnapshot = await db.collection('conversations').get();
    
    if (conversationsSnapshot.empty) {
      console.log('No conversations to check.');
      return;
    }
    
    const batchSize = 500;
    const batches = [];
    let currentBatch = db.batch();
    let operationCounter = 0;
    let emptyConversationsCount = 0;
    
    // For each conversation, check if it has any messages
    for (const conversationDoc of conversationsSnapshot.docs) {
      const conversationId = conversationDoc.id;
      const messagesQuery = db.collection('messages')
        .where('conversationId', '==', conversationId)
        .limit(1);
      
      const messagesSnapshot = await messagesQuery.get();
      
      // If no messages, delete the conversation
      if (messagesSnapshot.empty) {
        currentBatch.delete(conversationDoc.ref);
        operationCounter++;
        emptyConversationsCount++;
        
        if (operationCounter >= batchSize) {
          batches.push(currentBatch.commit());
          currentBatch = db.batch();
          operationCounter = 0;
        }
      }
    }
    
    if (operationCounter > 0) {
      batches.push(currentBatch.commit());
    }
    
    if (batches.length > 0) {
      await Promise.all(batches);
    }
    
    console.log(`Deleted ${emptyConversationsCount} empty conversations.`);
  } catch (error) {
    console.error('Error cleaning up empty conversations:', error);
  }
} 