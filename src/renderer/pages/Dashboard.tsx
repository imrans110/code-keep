/* eslint-disable jsx-a11y/anchor-is-valid */
import { CreateSnippetTrigger } from 'renderer/components/CreateSnippetTrigger';
import { Separator } from 'renderer/components/ui/separator';
import { SnippetList } from 'renderer/components/SnippetList';

function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white flex flex-col overflow-y-auto">
        {/* Sidebar Content */}
        <div className="p-4 flex-grow">
          <h2 className="text-xl font-semibold mb-4">CodeKeep Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block text-gray-300 hover:text-white">
                Snippets
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-gray-200 sticky top-0 z-10">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
            Welcome to <span className="underline text-gray-800">CodeKeep</span>
          </h1>
          <CreateSnippetTrigger />
        </header>

        <Separator />

        {/* Dashboard Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <SnippetList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
