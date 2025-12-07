// ============================================================================
// TABLER ICONS
// ============================================================================
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBrandGithub,
  IconBrandTwitter,
  IconChartLine,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCommand,
  IconCreditCard,
  IconDeviceLaptop,
  IconDotsVertical,
  IconFile,
  IconFileText,
  IconHelpCircle,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconLoader2,
  IconLogin,
  IconMoon,
  IconPhoto,
  IconPizza,
  IconPlus,
  IconProps,
  IconSettings,
  IconShoppingBag,
  IconSun,
  IconTrash,
  IconUser,
  IconUserCircle,
  IconUserEdit,
  IconUserX,
  IconWallet,
  IconX,
} from "@tabler/icons-react";

// ============================================================================
// LUCIDE REACT
// ============================================================================
import { Mail, Plus } from "lucide-react";

// ============================================================================
// REACT ICONS
// ============================================================================
import { FaGamepad } from "react-icons/fa";
import { IoRibbonOutline } from "react-icons/io5";
import { LuBike } from "react-icons/lu";
import { MdOutlineAddCard } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { RiAdvertisementLine, RiShoppingCartLine } from "react-icons/ri";

const TablerIcons = {
  dashboard: IconLayoutDashboard,
  logo: IconCommand,
  login: IconLogin,
  close: IconX,
  product: IconShoppingBag,
  spinner: IconLoader2,
  kanban: IconLayoutKanban,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  trash: IconTrash,
  employee: IconUserX,
  post: IconFileText,
  page: IconFile,
  userPen: IconUserEdit,
  user2: IconUserCircle,
  media: IconPhoto,
  settings: IconSettings,
  billing: IconCreditCard,
  ellipsis: IconDotsVertical,
  add: IconPlus,
  warning: IconAlertTriangle,
  user: IconUser,
  arrowRight: IconArrowRight,
  help: IconHelpCircle,
  pizza: IconPizza,
  sun: IconSun,
  moon: IconMoon,
  laptop: IconDeviceLaptop,
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  check: IconCheck,
  wallet: IconWallet,
  chart: IconChartLine,
};

const LucideIcons = {
  plus: Plus,
  mail: Mail,
};

const ReactIcons = {
  cart: RiShoppingCartLine,
  promotion: RiAdvertisementLine,
  ribbonOutline: IoRibbonOutline,
  users: PiUsersThreeLight,
  rider: LuBike,
  payouts: MdOutlineAddCard,
  controller: FaGamepad,
};

// ============================================================================
// COMBINED EXPORTS
// ============================================================================
const Icons = {
  ...TablerIcons,
  ...LucideIcons,
  ...ReactIcons,
};

export type Icon = React.ComponentType<IconProps>;
export { Icons, TablerIcons, LucideIcons, ReactIcons };
