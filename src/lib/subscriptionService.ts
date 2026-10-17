import { db, OperationType, handleFirestoreError, isFirebaseConfigured, auth } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export interface SubscriptionStatus {
  status: "free" | "active" | "expired" | "founder";
  planName: string;
  subscribedApps: string[];
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  customerEmail: string;
  appSource: string;
  isFounder?: boolean;
  founderNumber?: number;
  perpetual?: boolean;
}

// The 5 initial application variants + any custom remixed apps
export const CONNECTED_APPS = [
  "InfoPerso Master (Cette application)",
  "Vos Remixes d'Applications (Illimité)",
];

const DEFAULT_FREE_STATUS = (email: string = ""): SubscriptionStatus => ({
  status: "free",
  planName: "Forfait Découverte",
  subscribedApps: CONNECTED_APPS,
  expiresAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customerEmail: email,
  appSource: "System"
});

/**
 * Fetch the current subscription status from Firestore or localStorage.
 */
export async function getSubscription(uid: string): Promise<SubscriptionStatus | null> {
  const localKey = `infoperso_subscription_${uid}`;
  if (!isFirebaseConfigured || !auth.currentUser) {
    try {
      const stored = localStorage.getItem(localKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  const targetUid = auth.currentUser.uid;
  const path = `subscriptions/${targetUid}`;
  try {
    const docRef = doc(db, "subscriptions", targetUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SubscriptionStatus;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Real-time listener for the user's subscription status.
 * This is perfect because if the subscription status is updated on APP 1,
 * APP 2-5 will instantly receive the state update in real-time if they are open!
 */
export function listenToSubscription(
  uid: string,
  onUpdate: (status: SubscriptionStatus) => void,
  userEmail: string = ""
): () => void {
  const localKey = `infoperso_subscription_${uid}`;
  if (!isFirebaseConfigured || !auth.currentUser) {
    try {
      const stored = localStorage.getItem(localKey);
      onUpdate(stored ? JSON.parse(stored) : DEFAULT_FREE_STATUS(userEmail));
    } catch {
      onUpdate(DEFAULT_FREE_STATUS(userEmail));
    }
    return () => {};
  }

  const targetUid = auth.currentUser.uid;
  const docRef = doc(db, "subscriptions", targetUid);
  const path = `subscriptions/${targetUid}`;
  
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as SubscriptionStatus);
      } else {
        onUpdate(DEFAULT_FREE_STATUS(userEmail));
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Simulate subscribing/upgrading a user to a premium multi-app plan.
 */
export async function subscribeUser(
  uid: string,
  email: string,
  appSource: string,
  planName: string = "Premium Multi-App (10€/3mois puis 5€/mois) 👑",
  durationMonths: number = 3
): Promise<SubscriptionStatus> {
  const expires = new Date();
  expires.setMonth(expires.getMonth() + durationMonths);

  const targetUid = auth.currentUser ? auth.currentUser.uid : uid;
  const targetEmail = (auth.currentUser && auth.currentUser.email) ? auth.currentUser.email : email;

  const subscriptionData: SubscriptionStatus = {
    status: "active",
    planName,
    subscribedApps: CONNECTED_APPS,
    expiresAt: expires.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerEmail: targetEmail,
    appSource
  };

  const localKey = `infoperso_subscription_${targetUid}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(subscriptionData));
  } catch (e) {
    console.warn("Local storage subscription save error:", e);
  }

  if (!isFirebaseConfigured || !auth.currentUser) {
    return subscriptionData;
  }

  const path = `subscriptions/${targetUid}`;
  try {
    const docRef = doc(db, "subscriptions", targetUid);
    await setDoc(docRef, subscriptionData);
    return subscriptionData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Simulate cancellation/expiry of the subscription for testing purposes.
 */
export async function simulateExpiry(uid: string, email: string): Promise<SubscriptionStatus> {
  const targetUid = auth.currentUser ? auth.currentUser.uid : uid;
  const targetEmail = (auth.currentUser && auth.currentUser.email) ? auth.currentUser.email : email;

  const subscriptionData: SubscriptionStatus = {
    status: "expired",
    planName: "Abonnement Expiré",
    subscribedApps: CONNECTED_APPS,
    expiresAt: new Date(Date.now() - 86400000).toISOString(), // expired yesterday
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    customerEmail: targetEmail,
    appSource: "Simulation"
  };

  const localKey = `infoperso_subscription_${targetUid}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(subscriptionData));
  } catch (e) {
    console.warn("Local storage subscription save error:", e);
  }

  if (!isFirebaseConfigured || !auth.currentUser) {
    return subscriptionData;
  }

  const path = `subscriptions/${targetUid}`;
  try {
    const docRef = doc(db, "subscriptions", targetUid);
    await setDoc(docRef, subscriptionData);
    return subscriptionData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Reset/Delete subscription back to free.
 */
export async function resetToFree(uid: string, email: string): Promise<SubscriptionStatus> {
  const targetUid = auth.currentUser ? auth.currentUser.uid : uid;
  const targetEmail = (auth.currentUser && auth.currentUser.email) ? auth.currentUser.email : email;

  const subscriptionData = DEFAULT_FREE_STATUS(targetEmail);
  const localKey = `infoperso_subscription_${targetUid}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(subscriptionData));
  } catch (e) {
    console.warn("Local storage subscription reset error:", e);
  }

  if (!isFirebaseConfigured || !auth.currentUser) {
    return subscriptionData;
  }

  const path = `subscriptions/${targetUid}`;
  try {
    const docRef = doc(db, "subscriptions", targetUid);
    await setDoc(docRef, subscriptionData);
    return subscriptionData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Activate the official "Membre Fondateur — Licence Perpétuelle" plan.
 * Minimum 30 €, guaranteed lifetime access across all apps.
 */
export async function activateFounderPlan(
  uid: string,
  email: string,
  contributionAmount: number = 30,
  donorName: string = ""
): Promise<SubscriptionStatus> {
  const memberNumber = Number(localStorage.getItem("infoperso_founder_number")) || 84;
  const targetUid = auth.currentUser ? auth.currentUser.uid : uid;
  const targetEmail = (auth.currentUser && auth.currentUser.email) ? auth.currentUser.email : email;

  const founderData: SubscriptionStatus = {
    status: "founder",
    planName: "Pass Fondateur — Licence Perpétuelle 👑",
    subscribedApps: CONNECTED_APPS,
    expiresAt: null, // Lifetime!
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerEmail: targetEmail,
    appSource: "Membre Fondateur Pionnier",
    isFounder: true,
    founderNumber: memberNumber,
    perpetual: true
  };

  const localKey = `infoperso_subscription_${targetUid}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(founderData));
    localStorage.setItem("infoperso_is_founder", "true");
    localStorage.setItem("infoperso_founder_number", String(memberNumber));
    localStorage.setItem("alphabette_user_plan", "founder");
    localStorage.setItem("alphabette_founder_amount", String(contributionAmount));
    if (donorName) localStorage.setItem("infoperso_founder_name", donorName);

    // Notify listeners across applet
    window.dispatchEvent(new CustomEvent("alphabette_quota_updated"));
    window.dispatchEvent(new CustomEvent("alphabette_plan_updated", { detail: founderData }));
  } catch (e) {
    console.warn("Local storage founder save error:", e);
  }

  if (!isFirebaseConfigured || !auth.currentUser) {
    return founderData;
  }

  const path = `subscriptions/${targetUid}`;
  try {
    const docRef = doc(db, "subscriptions", targetUid);
    await setDoc(docRef, founderData);
    return founderData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Check if the user is currently recognized as a Founder Member.
 */
export function isFounderMember(): boolean {
  try {
    return localStorage.getItem("infoperso_is_founder") === "true" ||
      localStorage.getItem("alphabette_user_plan") === "founder" ||
      localStorage.getItem("alphabette_user_plan") === "FONDATEUR";
  } catch {
    return false;
  }
}
