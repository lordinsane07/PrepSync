/**
 * Peer Percentile Batch Job
 *
 * Computes each user's percentile rank based on their average session scores.
 * Designed to run on a cron schedule (e.g., every 6 hours).
 *
 * Usage:  npx ts-node src/jobs/peerPercentile.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDatabase } from '../config/db';
import { User } from '../models';

// We import Session directly since it's not in the barrel export
import Session from '../models/Session';

interface UserScore {
  userId: string;
  avgScore: number;
}

async function computePercentiles(): Promise<void> {
  console.log('[PeerPercentile] Starting batch job...');

  // Aggregate: average overallScore per user for completed sessions
  const results: UserScore[] = await Session.aggregate([
    { $match: { status: 'completed', 'evaluationReport.overallScore': { $exists: true, $gt: 0 } } },
    {
      $group: {
        _id: '$userId',
        avgScore: { $avg: '$evaluationReport.overallScore' },
        sessionCount: { $sum: 1 },
      },
    },
    { $match: { sessionCount: { $gte: 3 } } }, // Minimum 3 sessions for a percentile
    { $sort: { avgScore: 1 } },
    {
      $project: {
        userId: '$_id',
        avgScore: 1,
        _id: 0,
      },
    },
  ]);

  if (results.length === 0) {
    console.log('[PeerPercentile] No users with enough sessions found.');
    return;
  }

  const totalUsers = results.length;
  console.log(`[PeerPercentile] Computing percentiles for ${totalUsers} users...`);

  // Compute percentile rank for each user
  const updates = results.map((user, index) => {
    const percentile = Math.round(((index + 1) / totalUsers) * 100);
    return {
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(user.userId) },
        update: {
          $set: {
            'stats.peerPercentile': percentile,
            'stats.avgScore': Math.round(user.avgScore),
            'stats.percentileUpdatedAt': new Date(),
          },
        },
      },
    };
  });

  // Bulk update users
  const result = await User.bulkWrite(updates);
  console.log(`[PeerPercentile] Updated ${result.modifiedCount} users.`);
  console.log('[PeerPercentile] Batch job complete.');
}

// Run as standalone script
async function main() {
  try {
    await connectDatabase();
    await computePercentiles();
  } catch (error) {
    console.error('[PeerPercentile] Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();

export { computePercentiles };
