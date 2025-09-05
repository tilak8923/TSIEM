import { config } from 'dotenv';
config();

import '@/ai/flows/generate-security-report.ts';
import '@/ai/flows/provide-command-line-assistance.ts';
import '@/ai/flows/analyze-threat-feed.ts';