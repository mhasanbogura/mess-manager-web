.class public final synthetic La05;
.super Ljava/lang/Object;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"

# interfaces
.implements Ljava/lang/Runnable;


# instance fields
.field public final synthetic a:I

.field public final synthetic b:Lc05;

.field public final synthetic c:I

.field public final synthetic d:Lh05;


# direct methods
.method public synthetic constructor <init>(Lc05;ILh05;)V
    .locals 1

    .line 1
    const/4 v0, 0x1

    .line 2
    iput v0, p0, La05;->a:I

    .line 3
    .line 4
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 5
    .line 6
    .line 7
    iput-object p1, p0, La05;->b:Lc05;

    .line 8
    .line 9
    iput p2, p0, La05;->c:I

    .line 10
    .line 11
    iput-object p3, p0, La05;->d:Lh05;

    .line 12
    .line 13
    return-void
.end method

.method public synthetic constructor <init>(Lc05;Lh05;I)V
    .locals 1

    const/4 v0, 0x0

    iput v0, p0, La05;->a:I

    .line 14
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, La05;->b:Lc05;

    iput-object p2, p0, La05;->d:Lh05;

    iput p3, p0, La05;->c:I

    return-void
.end method


# virtual methods
.method public final synthetic run()V
    .locals 3

    .line 1
    iget v0, p0, La05;->a:I

    .line 2
    .line 3
    iget-object v1, p0, La05;->d:Lh05;

    .line 4
    .line 5
    iget v2, p0, La05;->c:I

    .line 6
    .line 7
    iget-object p0, p0, La05;->b:Lc05;

    .line 8
    .line 9
    packed-switch v0, :pswitch_data_0

    .line 10
    .line 11
    .line 12
    if-lez v2, :cond_0

    .line 13
    .line 14
    invoke-virtual {p0, v1, v2}, Lc05;->n(Lh05;I)V

    .line 15
    .line 16
    .line 17
    :cond_0
    const-wide/16 v0, 0x0

    .line 18
    .line 19
    invoke-virtual {p0, v0, v1}, Lc05;->k(J)V

    .line 20
    .line 21
    .line 22
    return-void

    .line 23
    :pswitch_0
    invoke-virtual {p0, v1, v2}, Lc05;->n(Lh05;I)V

    .line 24
    .line 25
    .line 26
    return-void

    .line 27
    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_0
    .end packed-switch
.end method
