import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, List, Plus } from 'lucide-react';

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats = {
        totalLists: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
    },
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 bg-gradient-to-br from-background to-muted/20 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="mt-1 text-muted-foreground">Welcome back! Here's your overview</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('lists.index')}>
                            <Button className="bg-primary text-white shadow-lg hover:bg-primary/90">
                                <List className="mr-2 h-4 w-4" />
                                View Lists
                            </Button>
                        </Link>
                        <Link href={route('tasks.index')}>
                            <Button className="bg-primary text-white shadow-lg hover:bg-primary/90">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                View Tasks
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* TOTAL LISTS */}
                    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">Total Lists</CardTitle>
                            <List className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">{stats.totalLists}</div>
                            <p className="text-xs text-muted-foreground">Your task lists</p>
                        </CardContent>
                    </Card>

                    {/* TOTAL TASKS */}
                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-500">Total Tasks</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats.totalTasks}</div>
                            <p className="text-xs text-muted-foreground">All your tasks</p>
                        </CardContent>
                    </Card>

                    {/* PENDING TASKS */}
                    <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-500">Pending Tasks</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">{stats.pendingTasks}</div>
                            <p className="text-xs text-muted-foreground">Tasks to complete</p>
                        </CardContent>
                    </Card>

                    {/* COMPLETED TASKS */}
                    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-500">Completed Tasks</CardTitle>
                            <AlertCircle className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-500">{stats.completedTasks}</div>
                            <p className="text-xs text-muted-foreground">Tasks done</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-4 grid gap-4 p-6 md:grid-cols-2">
                {/* QUICK ACTIONS */}
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <Link href={route('lists.index')}>
                                <Button variant="outline" className="w-full justify-start">
                                    <List className="mr-2 h-4 w-4" />
                                    View All
                                </Button>
                            </Link>
                            <Link href={route('tasks.index')}>
                                <Button variant="outline" className="w-full justify-start">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* RECENT ACTIVITY */}
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <Plus className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Welcome to Task Manager</p>
                                    <p className="text-xs text-muted-foreground">Get started by creating your first list or task</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
