'use client';

import { useState } from 'react';
import { storage } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface Props {
  current: string;
  nickname: string;
  onSave: (next: { avatar: string; nickname: string }) => void;
  onClose: () => void;
}

export default function AvatarPicker({ current, nickname, onSave, onClose }: Props) {
  const [avatar, setAvatar] = useState(current);
  const [name, setName] = useState(nickname);
  const pool = storage.getAvatarPool();
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-center">修改资料</h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {pool.map((e) => (
            <button
              key={e}
              onClick={() => setAvatar(e)}
              className={cn(
                'aspect-square text-3xl rounded-2xl flex items-center justify-center transition',
                avatar === e ? 'bg-cube-yellow ring-2 ring-cube-blue' : 'bg-gray-100',
              )}
            >
              {e}
            </button>
          ))}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="昵称"
          maxLength={12}
          className="mt-4 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-cube-blue"
        />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={onClose} className="btn-ghost">取消</button>
          <button
            onClick={() => onSave({ avatar, nickname: name.trim() || '小魔方手' })}
            className="btn-primary"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
