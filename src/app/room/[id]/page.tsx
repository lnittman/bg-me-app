import { Suspense } from 'react';
import { GameRoom } from '@/components/GameRoom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RoomPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading game room...</div>}>
        <GameRoom roomId={params.id} />
      </Suspense>
    </ErrorBoundary>
  );
}
