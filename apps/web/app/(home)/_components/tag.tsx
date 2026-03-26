import React from 'react';
import { Badge } from 'lucide-react';

const Tag = ({ content }: { content: string }) => {
  return <Badge>{content}</Badge>;
};

export default Tag;
