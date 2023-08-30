import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";

interface ChatIdPageProps {
  // NEXT convention like the search params. 
  // In this case it's only one param as chatId and not a list with multiple params
  // starting with ?
  params: {
    chatId: string;
  }
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        }
      },
      _count: {
        select: {
          messages: true
        }
      }
    }
  })

  if (!companion) {
    return redirect("/")
  }

  return (
    <ChatClient companion={companion} />
  );
}
 
export default ChatIdPage;