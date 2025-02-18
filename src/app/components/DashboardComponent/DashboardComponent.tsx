"use client";

import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute"; // Import the HOC

import {
  IconLogout,
  IconReceipt2,
  IconShoppingCart,
  IconSoup,
  IconUserCircle,
  IconBrandGoogleAnalytics,
  IconInbox
} from "@tabler/icons-react";
import { AppShell, Group, Button, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import classes from "@/app/components/DashboardComponent/DashboardComponent.module.css";

// Import the components to be rendered
import UploadBill from "@/app/components/InsideDashboardItems/UploadBill";
import GroceryList from "@/app/components/InsideDashboardItems/GroceryList";
import Recipe from "@/app/components/InsideDashboardItems/Receipe";
import Profile from "@/app/components/InsideDashboardItems/Profile";
import ShowPost from "@/app/components/InsideDashboardItems/ShowPost";
import Leaderboard from "../InsideDashboardItems/Leaderboard";

const navItems = [
  { key: "UploadBill", label: "Add Items", icon: IconReceipt2 },
  {
    key: "groceryList",
    label: "Show Available Grocery",
    icon: IconShoppingCart,
  },
  { key: "recipe", label: "Recipe", icon: IconSoup },
  { key: "showPost", label: "Show Post", icon: IconInbox },
  { key: "profile", label: "My Profile", icon: IconUserCircle },
  { key: "leaderBoard", label: "Leaderboard", icon: IconBrandGoogleAnalytics },
];

export function DashboardComponent() {
  const [opened, { toggle }] = useDisclosure(); // Controls sidebar toggle
  const router = useRouter();
  const [active, setActive] = useState("UploadBill"); // Default to Scan Bill

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      alert("Logged out successfully!");
      router.push("/auth?mode=login");
    } catch (err: any) {
      console.error("Logout failed:", err.message);
    }
  };

  // Function to render the selected component dynamically
  const renderContent = () => {
    switch (active) {
      case "UploadBill":
        return <UploadBill />;
      case "groceryList":
        return <GroceryList />;
      case "recipe":
        return <Recipe />;
      case "showPost":
        return <ShowPost />;
      case "profile":
        return <Profile />;
      case "leaderBoard":
        return <Leaderboard />;
      default:
        return <UploadBill />;
    }
  };

  return (
    <ProtectedRoute>
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 220, md: 280, lg: 320 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        {/* HEADER */}
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <img
                className="ml-10 w-auto h-auto max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
                src="/logo.png"
                alt="Logo"
                style={{ maxHeight: "50px" }}
              />
            </Group>
          </Group>
        </AppShell.Header>

        {/* SIDEBAR / NAVBAR */}
        <AppShell.Navbar p="md">
          <div>
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={active === item.key ? "filled" : "light"}
                leftSection={<item.icon size={20} />}
                fullWidth
                onClick={() => setActive(item.key)}
                mb="sm"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* LOGOUT BUTTON */}
          <Button
            leftSection={<IconLogout size={20} />}
            color="red"
            fullWidth
            mt="auto"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </AppShell.Navbar>

        {/* MAIN CONTENT - Dynamically Loaded Component */}
        <AppShell.Main>{renderContent()}</AppShell.Main>
      </AppShell>
    </ProtectedRoute>
  );
}
