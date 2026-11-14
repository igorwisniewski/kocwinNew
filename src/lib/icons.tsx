import React from 'react';
import {
    TrophyIcon,
    BoltIcon,
    DocumentMagnifyingGlassIcon,
    BriefcaseIcon,
    LockClosedIcon,
    ArrowsRightLeftIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    SparklesIcon,
    UserGroupIcon,
    ScaleIcon,
    CheckBadgeIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingOfficeIcon,
    ClockIcon,
    HeartIcon,
    StarIcon,
} from '@heroicons/react/24/outline';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    TrophyIcon,
    BoltIcon,
    DocumentMagnifyingGlassIcon,
    BriefcaseIcon,
    LockClosedIcon,
    ArrowsRightLeftIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    SparklesIcon,
    UserGroupIcon,
    ScaleIcon,
    CheckBadgeIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingOfficeIcon,
    ClockIcon,
    HeartIcon,
    StarIcon,
};

export function DynamicIcon({ name, className = 'w-6 h-6' }: { name?: string; className?: string }) {
    if (!name) return <ShieldCheckIcon className={className} />;
    const IconComp = iconMap[name] || ShieldCheckIcon;
    return <IconComp className={className} />;
}

export const availableIconNames = Object.keys(iconMap);
