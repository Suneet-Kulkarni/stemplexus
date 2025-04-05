import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { AlertCircle } from "lucide-react";

const ChallengeView = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Tables<'challenges'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setLoading(true);
        
        // Fetch challenge
        const { data: challengeData, error: challengeError } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', challengeId)
          .single();

        if (challengeError) throw challengeError;
        setChallenge(challengeData);
      } catch (error: any) {
        toast({
          title: "Error fetching challenge",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId, toast]);

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1" 
        onClick={() => navigate('/challenges')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Challenges
      </Button>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {challenge ? (
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{challenge.title}</CardTitle>
                <CardDescription>
                  {challenge.description || "Test your knowledge and skills"}
                </CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                {challenge.content ? (
                  <div dangerouslySetInnerHTML={{ __html: challenge.content }} />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    No content available for this challenge.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="default" className="w-full">
                  Start Challenge
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Challenge not found</h3>
              <p className="text-muted-foreground">
                The requested challenge could not be found.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChallengeView;
