'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { defaultAlertRules, sampleLogEntries, recentAlerts } from '@/lib/data';

const USER_ID_KEY = 'tsiem-user-id';
const USER_INITIALIZED_KEY = 'tsiem-user-initialized';

async function seedInitialData(userId: string) {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && localStorage.getItem(USER_INITIALIZED_KEY) === userId) {
        return; // User already exists and has been initialized
    }
    
    const batch = writeBatch(db);

    // Set a marker doc to indicate user exists
    if (!userDoc.exists()) {
       batch.set(userDocRef, { createdAt: new Date().toISOString() });
    }

    // Add default alert rules
    const rulesCollection = collection(db, 'users', userId, 'alertRules');
    defaultAlertRules.forEach(rule => {
        const newRuleRef = doc(rulesCollection);
        batch.set(newRuleRef, rule);
    });

    // Add sample logs
    const logsCollection = collection(db, 'users', userId, 'logs');
    sampleLogEntries.forEach(log => {
        const newLogRef = doc(logsCollection);
        batch.set(newLogRef, log);
    });

    // Add initial alerts
    const alertsCollection = collection(db, 'users', userId, 'alerts');
    recentAlerts.forEach(alert => {
        const newAlertRef = doc(alertsCollection);
        batch.set(newAlertRef, alert);
    });
    
    await batch.commit();
    localStorage.setItem(USER_INITIALIZED_KEY, userId);
}


export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only on the client
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    setUserId(storedUserId);

    // Seed data if the user is new
    seedInitialData(storedUserId).catch(console.error);

  }, []);

  return userId;
}
